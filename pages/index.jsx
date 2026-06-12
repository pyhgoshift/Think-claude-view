import { useState } from 'react';

const tasksData = [
    {
        id: 1,
        title: "Karakeep 구현 4단계 완수",
        phase: "1",
        status: "completed",
        description: "이전 프로젝트 완료",
        date: "2026-01-15"
    },
    {
        id: 2,
        title: "도메인 관리 대시보드 전체 구현 프로젝트",
        phase: "1",
        status: "inprogress",
        description: "FreeDomain을 PYHGOSHIFT에 통합하여 웹 대시보드에서 도메인 등록/조회/관리할 수 있는 시스템 구축",
        date: "2026-06-12"
    },
    {
        id: 3,
        title: "[1단계] 백엔드 API 엔드포인트 구현",
        phase: "1",
        status: "completed",
        description: "POST /api/domain/register, GET /api/domain/query, GET /api/domain/list 등 5개 엔드포인트 구현",
        date: "2026-06-12"
    },
    {
        id: 4,
        title: "[2단계] 프론트엔드 도메인 대시보드 UI 개발",
        phase: "1",
        status: "completed",
        description: "executives-dashboard.js 구현 - 8명 Executive, 6개 Division UI 및 Domain Manager",
        date: "2026-06-12"
    },
    {
        id: 5,
        title: "[3단계] 실제 FreeDomain API 연동",
        phase: "2",
        status: "pending",
        description: "Mock API를 실제 FreeDomain 서비스와 연동 (HTTP 요청, 인증, DNS 조회)",
        date: "2026-06-12"
    },
    {
        id: 6,
        title: "[4단계] 통합 테스트 및 배포",
        phase: "2",
        status: "pending",
        description: "전체 시스템 테스트 및 Docker 배포",
        date: "2026-06-12"
    },
    {
        id: 7,
        title: "프로젝트 관리 대시보드 구축",
        phase: "2",
        status: "inprogress",
        description: "작업 리스트, 진행 상황, 통계를 보여주는 홈페이지 같은 대시보드",
        date: "2026-06-12"
    },
    {
        id: 8,
        title: "FreeDomain 도메인 연결",
        phase: "2",
        status: "pending",
        description: "대시보드를 FreeDomain으로 등록된 도메인으로 접근 가능하게 설정",
        date: "2026-06-12"
    }
];

const BACKEND_API = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:8788';

export default function Dashboard() {
    const [currentSection, setCurrentSection] = useState('home');
    const [currentFilter, setCurrentFilter] = useState('all');
    const [domains, setDomains] = useState([]);
    const [domainName, setDomainName] = useState('');
    const [extension, setExtension] = useState('.dpdns.org');
    const [queryDomain, setQueryDomain] = useState('');
    const [queryResult, setQueryResult] = useState(null);
    const [dnsRecords, setDnsRecords] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    const [generatedCourse, setGeneratedCourse] = useState(null);
    const [courseLoading, setCourseLoading] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    const total = tasksData.length;
    const completed = tasksData.filter(t => t.status === 'completed').length;
    const inProgress = tasksData.filter(t => t.status === 'inprogress').length;
    const pending = tasksData.filter(t => t.status === 'pending').length;

    const filtered = currentFilter === 'all'
        ? tasksData
        : tasksData.filter(t => t.status === currentFilter);

    const getStatusLabel = (status) => {
        const labels = {
            'completed': '완료',
            'inprogress': '진행 중',
            'pending': '대기'
        };
        return labels[status] || status;
    };

    const getStatusClass = (status) => {
        const classes = {
            'completed': 'status-completed',
            'inprogress': 'status-inprogress',
            'pending': 'status-pending'
        };
        return classes[status] || '';
    };

    const registerDomain = async () => {
        if (!domainName.trim()) {
            setMessage('도메인명을 입력해주세요.');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${BACKEND_API}/api/domain/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ domain_name: domainName, extension })
            });
            const data = await response.json();
            if (data.status === 'success') {
                setMessage(`성공: ${domainName}${extension} 도메인이 등록되었습니다.`);
                setDomainName('');
                loadDomains();
            } else {
                setMessage(`오류: ${data.error?.message || '등록 실패'}`);
            }
        } catch (error) {
            setMessage(`연결 오류: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const queryDomainInfo = async () => {
        if (!queryDomain.trim()) {
            setMessage('도메인명을 입력해주세요.');
            return;
        }
        setLoading(true);
        setMessage('');
        try {
            const response = await fetch(`${BACKEND_API}/api/domain/query?domain=${queryDomain}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setQueryResult(data.domain_info);
                setMessage('조회 완료');
            } else {
                setMessage(`오류: ${data.error?.message || '조회 실패'}`);
                setQueryResult(null);
            }
        } catch (error) {
            setMessage(`연결 오류: ${error.message}`);
            setQueryResult(null);
        } finally {
            setLoading(false);
        }
    };

    const loadDomains = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BACKEND_API}/api/domain/list`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (data.status === 'success') {
                setDomains(data.domains || []);
                setMessage(`${data.domains?.length || 0}개의 도메인을 로드했습니다.`);
            } else {
                setMessage(`오류: ${data.error?.message || '로드 실패'}`);
                setDomains([]);
            }
        } catch (error) {
            setMessage(`연결 오류: ${error.message}`);
            setDomains([]);
        } finally {
            setLoading(false);
        }
    };

    const generateCourseFromPDF = async () => {
        if (!pdfFile) {
            setMessage('PDF 파일을 선택해주세요.');
            return;
        }
        setCourseLoading(true);
        setMessage('');
        try {
            const formData = new FormData();
            formData.append('file', pdfFile);

            const response = await fetch(`${BACKEND_API}/api/pdf/generate-course`, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.status === 'success') {
                setGeneratedCourse(data.course);
                setMessage('강좌 생성 완료!');
                setPdfFile(null);
            } else {
                setMessage(`오류: ${data.error?.message || '생성 실패'}`);
            }
        } catch (error) {
            setMessage(`연결 오류: ${error.message}`);
        } finally {
            setCourseLoading(false);
        }
    };

    return (
        <div style={styles.body}>
            <style>{`
                @media (max-width: 768px) {
                    body { margin: 0; padding: 0; }

                    .header { padding: 15px 0 !important; }
                    .navbar { display: flex !important; justify-content: space-between !important; align-items: center !important; }
                    .logo { font-size: 18px !important; }
                    .nav-desktop { display: none !important; }
                    .nav-mobile { display: block !important; }
                    .hamburger { background: none; border: none; font-size: 24px; cursor: pointer; color: #667eea; }

                    .nav-menu {
                        position: absolute;
                        top: 60px;
                        left: 0;
                        right: 0;
                        background: white;
                        border-bottom: 1px solid #eee;
                        flex-direction: column !important;
                        gap: 0 !important;
                        max-height: 0;
                        overflow: hidden;
                        transition: max-height 0.3s ease;
                    }

                    .nav-menu.open { max-height: 500px; }
                    .nav-menu a { padding: 12px 20px !important; border-bottom: 1px solid #f0f0f0; }

                    .container { padding: 15px 10px !important; margin: 0 auto !important; }
                    .stats { grid-template-columns: 1fr 1fr !important; gap: 15px !important; }
                    .hero { padding: 30px 20px !important; margin-bottom: 30px !important; }
                    .hero h1 { font-size: 32px !important; }

                    .tasksContainer { padding: 15px !important; margin-bottom: 20px !important; }
                    .h2 { font-size: 20px !important; margin-bottom: 15px !important; }
                    .subTitle { font-size: 16px !important; margin-bottom: 15px !important; }

                    .taskFilter { gap: 6px !important; flex-wrap: wrap !important; }
                    .filterBtn { padding: 6px 12px !important; font-size: 12px !important; }
                    .input { padding: 8px 10px !important; font-size: 14px !important; }
                    .submitBtn { padding: 8px 16px !important; font-size: 14px !important; min-width: auto !important; }

                    .taskItem { padding: 12px !important; margin-bottom: 10px !important; }
                    .taskTitle { font-size: 14px !important; }
                    .taskDescription { font-size: 12px !important; }
                    .taskHeader { flex-direction: column !important; align-items: flex-start !important; }
                    .taskStatus { margin-top: 8px !important; }

                    .formSection { padding: 15px 0 !important; margin-bottom: 20px !important; }
                    .formGroup { margin-bottom: 12px !important; }
                    .label { font-size: 13px !important; }

                    .domainList { margin-top: 15px !important; }
                    .domainItem { padding: 12px !important; margin-bottom: 8px !important; }
                    .domainName { font-size: 14px !important; }
                    .domainMeta { flex-direction: column !important; gap: 4px !important; font-size: 11px !important; }

                    .messageBox { padding: 10px 12px !important; margin-bottom: 15px !important; font-size: 13px !important; }
                    .resultBox { padding: 12px !important; }
                    .resultBox p { font-size: 13px !important; margin: 8px 0 !important; }

                    .tabContainer { gap: 5px !important; margin-bottom: 20px !important; }
                    .tabBtn { padding: 8px 12px !important; font-size: 12px !important; }

                    .footer { font-size: 11px !important; padding: 15px !important; margin-top: 30px !important; }
                }

                @media (max-width: 480px) {
                    .logo { font-size: 14px !important; }
                    .stats { grid-template-columns: 1fr !important; }
                    .taskFilter { flex-direction: column !important; }
                    .filterBtn { width: 100%; padding: 10px !important; }
                    .hero { padding: 20px 15px !important; }
                    .hero h1 { font-size: 24px !important; }
                    .h2 { font-size: 18px !important; }
                    .taskHeader { flex-direction: column !important; }
                    .taskStatus { align-self: flex-start !important; margin-top: 8px !important; }
                    .input { width: 100%; padding: 10px 8px !important; }
                    .submitBtn { width: 100%; padding: 10px 8px !important; }
                    .container { padding: 10px 8px !important; }
                    .tasksContainer { padding: 12px !important; }
                    .formSection { padding: 12px 0 !important; }
                    .tabContainer { flex-direction: column !important; }
                    .tabBtn { width: 100%; border-bottom: none !important; border-right: 3px solid transparent !important; }
                    .tabBtn.active { border-right-color: #667eea !important; }
                    .hero h1 { line-height: 1.2 !important; }
                    .statCard { padding: 15px !important; }
                    .statNumber { font-size: 28px !important; }
                }
            `}</style>
            <header style={styles.header} className="header">
                <div style={{...styles.headerContent, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={styles.logo} className="logo">🚀 PYHGOSHIFT</div>
                    <button
                        style={{display: 'none'}}
                        className="hamburger"
                        onClick={() => setMobileNavOpen(!mobileNavOpen)}
                    >
                        ☰
                    </button>
                    <nav style={{...styles.nav, ...(!mobileNavOpen && {display: 'flex'})}} className={`nav-desktop`}>
                        <a
                            style={{...styles.navLink, ...(currentSection === 'home' ? styles.navLinkActive : {})}}
                            onClick={() => setCurrentSection('home')}
                        >
                            홈
                        </a>
                        <a
                            style={{...styles.navLink, ...(currentSection === 'tasks' ? styles.navLinkActive : {})}}
                            onClick={() => setCurrentSection('tasks')}
                        >
                            작업 리스트
                        </a>
                        <a
                            style={{...styles.navLink, ...(currentSection === 'stats' ? styles.navLinkActive : {})}}
                            onClick={() => setCurrentSection('stats')}
                        >
                            통계
                        </a>
                        <a
                            style={{...styles.navLink, ...(currentSection === 'domain' ? styles.navLinkActive : {})}}
                            onClick={() => {
                                setCurrentSection('domain');
                                loadDomains();
                            }}
                        >
                            도메인 관리
                        </a>
                        <a
                            style={{...styles.navLink, ...(currentSection === 'pdfcourse' ? styles.navLinkActive : {})}}
                            onClick={() => setCurrentSection('pdfcourse')}
                        >
                            PDF 강좌
                        </a>
                    </nav>
                </div>
            </header>

            <div style={styles.container} className="container">
                {currentSection === 'home' && (
                    <>
                        <div style={styles.hero} className="hero">
                            <h1 style={styles.h1} className="h1">PYHGOSHIFT 프로젝트</h1>
                            <p style={styles.heroP}>8명의 Executive와 6개 Division으로 구성된 AI 경영 시스템</p>
                            <p style={styles.smallP}>Executive System + Domain Management + Web Dashboard 통합</p>
                        </div>

                        <div style={styles.stats} className="stats">
                            <div style={styles.statCard} className="statCard">
                                <div style={styles.statNumber}>{total}</div>
                                <div style={styles.statLabel}>전체 작업</div>
                            </div>
                            <div style={styles.statCard} className="statCard">
                                <div style={styles.statNumber}>{completed}</div>
                                <div style={styles.statLabel}>완료된 작업</div>
                            </div>
                            <div style={styles.statCard} className="statCard">
                                <div style={styles.statNumber}>{inProgress}</div>
                                <div style={styles.statLabel}>진행 중</div>
                            </div>
                            <div style={styles.statCard} className="statCard">
                                <div style={styles.statNumber}>{pending}</div>
                                <div style={styles.statLabel}>대기 중</div>
                            </div>
                        </div>
                    </>
                )}

                {currentSection === 'tasks' && (
                    <div style={styles.tasksContainer} className="tasksContainer">
                        <h2 style={styles.h2} className="h2">프로젝트 작업 리스트</h2>

                        <div style={styles.taskFilter} className="taskFilter">
                            {['all', 'pending', 'inprogress', 'completed'].map(filter => (
                                <button
                                    key={filter}
                                    className="filterBtn"
                                    style={{
                                        ...styles.filterBtn,
                                        ...(currentFilter === filter ? styles.filterBtnActive : {})
                                    }}
                                    onClick={() => setCurrentFilter(filter)}
                                >
                                    {filter === 'all' ? '전체' :
                                     filter === 'pending' ? '대기' :
                                     filter === 'inprogress' ? '진행 중' : '완료'}
                                </button>
                            ))}
                        </div>

                        <div>
                            {filtered.length === 0 ? (
                                <div style={styles.emptyState}>
                                    <div style={styles.emptyIcon}>📭</div>
                                    <p>작업이 없습니다</p>
                                </div>
                            ) : (
                                filtered.map(task => (
                                    <div key={task.id} style={styles.taskItem} className="taskItem">
                                        <div style={styles.taskHeader} className="taskHeader">
                                            <div>
                                                <div style={styles.taskTitle} className="taskTitle">{task.title}</div>
                                                <div style={styles.taskDescription} className="taskDescription">{task.description}</div>
                                            </div>
                                            <span style={{...styles.taskStatus, ...styles[getStatusClass(task.status)]}} className="taskStatus">
                                                {getStatusLabel(task.status)}
                                            </span>
                                        </div>
                                        <div style={styles.taskMeta}>
                                            <span>📋 Phase {task.phase}</span>
                                            <span>📅 {task.date}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {currentSection === 'stats' && (
                    <div style={styles.tasksContainer} className="tasksContainer">
                        <h2 style={styles.h2} className="h2">프로젝트 진행률</h2>

                        <div style={{marginBottom: '30px'}}>
                            <h3 style={styles.phaseTitle}>Phase 1: 초기 통합</h3>
                            <div style={styles.progressBar}>
                                <div style={{...styles.progressFill, width: '100%'}}></div>
                            </div>
                            <p style={styles.progressText}>4/4 완료 (100%)</p>
                        </div>

                        <div style={{marginBottom: '30px'}}>
                            <h3 style={styles.phaseTitle}>Phase 2: 실제 API 연동</h3>
                            <div style={styles.progressBar}>
                                <div style={{...styles.progressFill, width: '0%'}}></div>
                            </div>
                            <p style={styles.progressText}>0/3 완료 (0%)</p>
                        </div>

                        <div style={{marginBottom: '30px'}}>
                            <h3 style={styles.phaseTitle}>Phase 3: 테스트 및 배포</h3>
                            <div style={styles.progressBar}>
                                <div style={{...styles.progressFill, width: '0%'}}></div>
                            </div>
                            <p style={styles.progressText}>0/4 완료 (0%)</p>
                        </div>
                    </div>
                )}

                {currentSection === 'domain' && (
                    <div style={styles.tasksContainer} className="tasksContainer">
                        <h2 style={styles.h2} className="h2">도메인 관리</h2>
                        {message && <div style={styles.messageBox} className="messageBox">{message}</div>}

                        <div style={styles.tabContainer} className="tabContainer">
                            <button style={{...styles.tabBtn, ...styles.tabBtnActive}} className="tabBtn active">도메인 등록</button>
                            <button style={styles.tabBtn} className="tabBtn">도메인 조회</button>
                            <button style={styles.tabBtn} className="tabBtn">도메인 리스트</button>
                            <button style={styles.tabBtn} className="tabBtn">DNS 관리</button>
                        </div>

                        <div style={styles.formSection} className="formSection">
                            <h3 style={styles.subTitle} className="subTitle">새 도메인 등록</h3>
                            <div style={styles.formGroup} className="formGroup">
                                <label style={styles.label} className="label">도메인명</label>
                                <input
                                    type="text"
                                    value={domainName}
                                    onChange={(e) => setDomainName(e.target.value)}
                                    placeholder="example"
                                    style={styles.input}
                                    className="input"
                                />
                            </div>
                            <div style={styles.formGroup} className="formGroup">
                                <label style={styles.label} className="label">확장자</label>
                                <select
                                    value={extension}
                                    onChange={(e) => setExtension(e.target.value)}
                                    style={styles.input}
                                    className="input"
                                >
                                    <option value=".dpdns.org">.dpdns.org</option>
                                    <option value=".us.kg">.us.kg</option>
                                    <option value=".qzz.io">.qzz.io</option>
                                    <option value=".xx.kg">.xx.kg</option>
                                    <option value=".qd.je">.qd.je</option>
                                </select>
                            </div>
                            <button style={styles.submitBtn} className="submitBtn" onClick={() => registerDomain()}>
                                {loading ? '등록 중...' : '도메인 등록'}
                            </button>
                        </div>

                        <div style={styles.formSection} className="formSection">
                            <h3 style={styles.subTitle} className="subTitle">도메인 조회</h3>
                            <div style={styles.formGroup} className="formGroup">
                                <label style={styles.label} className="label">도메인명</label>
                                <input
                                    type="text"
                                    value={queryDomain}
                                    onChange={(e) => setQueryDomain(e.target.value)}
                                    placeholder="example.dpdns.org"
                                    style={styles.input}
                                    className="input"
                                />
                            </div>
                            <button style={styles.submitBtn} className="submitBtn" onClick={() => queryDomainInfo()}>
                                {loading ? '조회 중...' : '조회'}
                            </button>
                            {queryResult && (
                                <div style={styles.resultBox} className="resultBox">
                                    <p><strong>도메인:</strong> {queryResult.domain}</p>
                                    <p><strong>상태:</strong> {queryResult.status}</p>
                                    <p><strong>등록일:</strong> {queryResult.registration_date}</p>
                                    <p><strong>만료일:</strong> {queryResult.expiry_date}</p>
                                </div>
                            )}
                        </div>

                        <div style={styles.formSection} className="formSection">
                            <h3 style={styles.subTitle} className="subTitle">내 도메인 목록</h3>
                            <button style={styles.submitBtn} className="submitBtn" onClick={() => loadDomains()}>
                                {loading ? '로드 중...' : '도메인 새로고침'}
                            </button>
                            {domains.length > 0 ? (
                                <div style={styles.domainList} className="domainList">
                                    {domains.map((domain, idx) => (
                                        <div key={idx} style={styles.domainItem} className="domainItem">
                                            <div style={styles.domainName} className="domainName">{domain.name}</div>
                                            <div style={styles.domainMeta} className="domainMeta">
                                                <span>등록일: {domain.registration_date}</span>
                                                <span>만료일: {domain.expiry_date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p style={styles.emptyMessage}>등록된 도메인이 없습니다.</p>
                            )}
                        </div>
                    </div>
                )}

                {currentSection === 'pdfcourse' && (
                    <div style={styles.tasksContainer} className="tasksContainer">
                        <h2 style={styles.h2} className="h2">PDF 강좌 생성</h2>
                        {message && <div style={styles.messageBox} className="messageBox">{message}</div>}

                        <div style={styles.formSection} className="formSection">
                            <h3 style={styles.subTitle} className="subTitle">PDF 업로드</h3>
                            <div style={styles.formGroup} className="formGroup">
                                <label style={styles.label} className="label">PDF 파일</label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                                    style={{...styles.input, padding: '10px'}}
                                    className="input"
                                />
                                {pdfFile && <p style={{fontSize: '12px', color: '#666', marginTop: '8px'}}>선택됨: {pdfFile.name}</p>}
                            </div>
                            <button style={styles.submitBtn} className="submitBtn" onClick={() => generateCourseFromPDF()}>
                                {courseLoading ? '생성 중...' : '강좌 생성'}
                            </button>
                        </div>

                        {generatedCourse && (
                            <div style={styles.formSection} className="formSection">
                                <h3 style={styles.subTitle} className="subTitle">생성된 강좌</h3>
                                <div style={styles.resultBox} className="resultBox">
                                    <h4 style={{marginTop: 0}}>{generatedCourse.title}</h4>
                                    <p>{generatedCourse.description}</p>

                                    {generatedCourse.modules && generatedCourse.modules.length > 0 && (
                                        <div style={{marginTop: '20px'}}>
                                            <h5 style={{fontSize: '14px', fontWeight: '600', marginBottom: '10px'}}>모듈</h5>
                                            {generatedCourse.modules.map((module, idx) => (
                                                <div key={idx} style={{
                                                    padding: '12px',
                                                    background: '#f0f0f0',
                                                    borderRadius: '6px',
                                                    marginBottom: '10px'
                                                }}>
                                                    <strong>{module.title}</strong>
                                                    <p style={{fontSize: '12px', color: '#666', margin: '5px 0 0 0'}}>
                                                        {module.description}
                                                    </p>
                                                    {module.lessons && module.lessons.length > 0 && (
                                                        <div style={{marginTop: '8px', paddingLeft: '12px', borderLeft: '2px solid #667eea'}}>
                                                            {module.lessons.map((lesson, lidx) => (
                                                                <div key={lidx} style={{fontSize: '12px', marginBottom: '4px'}}>
                                                                    • {lesson.title}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <footer style={styles.footer} className="footer">
                <p>© 2026 PYHGOSHIFT Project. All rights reserved.</p>
                <p style={{fontSize: '12px', marginTop: '10px'}}>FreeDomain으로 제공됨</p>
            </footer>
        </div>
    );
}

const styles = {
    body: {
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        color: '#333',
        margin: 0,
        padding: 0,
    },
    header: {
        background: 'rgba(255,255,255,0.95)',
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    headerContent: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    logo: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#667eea',
    },
    nav: {
        display: 'flex',
        gap: '30px',
    },
    navLink: {
        textDecoration: 'none',
        color: '#333',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'color 0.3s',
        paddingBottom: '5px',
    },
    navLinkActive: {
        color: '#667eea',
        borderBottom: '2px solid #667eea',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    hero: {
        background: 'white',
        borderRadius: '12px',
        padding: '60px 40px',
        textAlign: 'center',
        marginBottom: '40px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    },
    h1: {
        fontSize: '48px',
        marginBottom: '20px',
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        margin: 0,
    },
    h2: {
        marginBottom: '20px',
        fontSize: '28px',
        color: '#333',
    },
    heroP: {
        fontSize: '18px',
        color: '#666',
        marginBottom: '10px',
    },
    smallP: {
        fontSize: '14px',
        color: '#999',
        marginBottom: '30px',
    },
    stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginTop: '40px',
    },
    statCard: {
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '8px',
        textAlign: 'center',
    },
    statNumber: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#667eea',
    },
    statLabel: {
        color: '#666',
        marginTop: '8px',
        fontSize: '14px',
    },
    tasksContainer: {
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    },
    taskFilter: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap',
    },
    filterBtn: {
        padding: '8px 16px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        background: 'white',
        cursor: 'pointer',
        transition: 'all 0.3s',
        fontSize: '14px',
    },
    filterBtnActive: {
        background: '#667eea',
        color: 'white',
        borderColor: '#667eea',
    },
    taskItem: {
        padding: '20px',
        border: '1px solid #eee',
        borderRadius: '8px',
        marginBottom: '15px',
        background: '#f9f9f9',
        transition: 'all 0.3s',
    },
    taskHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px',
    },
    taskTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
    },
    taskStatus: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
    },
    taskDescription: {
        color: '#666',
        fontSize: '14px',
        marginTop: '5px',
        lineHeight: '1.5',
    },
    taskMeta: {
        display: 'flex',
        gap: '20px',
        fontSize: '12px',
        color: '#999',
        marginTop: '10px',
    },
    'status-pending': {
        background: '#fff3cd',
        color: '#856404',
    },
    'status-inprogress': {
        background: '#d1ecf1',
        color: '#0c5460',
    },
    'status-completed': {
        background: '#d4edda',
        color: '#155724',
    },
    progressBar: {
        width: '100%',
        height: '8px',
        background: '#eee',
        borderRadius: '4px',
        overflow: 'hidden',
        marginTop: '10px',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #667eea, #764ba2)',
        transition: 'width 0.3s',
    },
    phaseTitle: {
        marginBottom: '15px',
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
        margin: 0,
    },
    progressText: {
        fontSize: '12px',
        color: '#999',
        marginTop: '5px',
        margin: 0,
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#999',
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '20px',
    },
    footer: {
        textAlign: 'center',
        color: 'white',
        padding: '20px',
        marginTop: '60px',
    },
    messageBox: {
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '20px',
        background: '#e8f5e9',
        color: '#2e7d32',
        border: '1px solid #81c784',
    },
    tabContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: '2px solid #eee',
    },
    tabBtn: {
        padding: '10px 20px',
        border: 'none',
        background: 'white',
        color: '#666',
        cursor: 'pointer',
        fontWeight: '500',
        borderBottom: '3px solid transparent',
        transition: 'all 0.3s',
    },
    tabBtnActive: {
        color: '#667eea',
        borderBottomColor: '#667eea',
    },
    formSection: {
        marginBottom: '30px',
        paddingBottom: '30px',
        borderBottom: '1px solid #eee',
    },
    subTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '20px',
        margin: 0,
    },
    formGroup: {
        marginBottom: '15px',
    },
    label: {
        display: 'block',
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        marginBottom: '8px',
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'inherit',
        boxSizing: 'border-box',
    },
    submitBtn: {
        padding: '10px 24px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: 'background 0.3s',
    },
    resultBox: {
        marginTop: '20px',
        padding: '16px',
        background: '#f5f5f5',
        borderRadius: '6px',
        border: '1px solid #ddd',
    },
    domainList: {
        marginTop: '20px',
    },
    domainItem: {
        padding: '15px',
        background: '#f9f9f9',
        border: '1px solid #eee',
        borderRadius: '6px',
        marginBottom: '10px',
    },
    domainName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px',
    },
    domainMeta: {
        display: 'flex',
        gap: '20px',
        fontSize: '13px',
        color: '#999',
    },
    emptyMessage: {
        marginTop: '20px',
        color: '#999',
        textAlign: 'center',
    },
};
