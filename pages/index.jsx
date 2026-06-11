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

export default function Dashboard() {
    const [currentSection, setCurrentSection] = useState('home');
    const [currentFilter, setCurrentFilter] = useState('all');

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

    return (
        <div style={styles.body}>
            <header style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.logo}>🚀 PYHGOSHIFT</div>
                    <nav style={styles.nav}>
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
                    </nav>
                </div>
            </header>

            <div style={styles.container}>
                {currentSection === 'home' && (
                    <>
                        <div style={styles.hero}>
                            <h1 style={styles.h1}>PYHGOSHIFT 프로젝트</h1>
                            <p style={styles.heroP}>8명의 Executive와 6개 Division으로 구성된 AI 경영 시스템</p>
                            <p style={styles.smallP}>Executive System + Domain Management + Web Dashboard 통합</p>
                        </div>

                        <div style={styles.stats}>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{total}</div>
                                <div style={styles.statLabel}>전체 작업</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{completed}</div>
                                <div style={styles.statLabel}>완료된 작업</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{inProgress}</div>
                                <div style={styles.statLabel}>진행 중</div>
                            </div>
                            <div style={styles.statCard}>
                                <div style={styles.statNumber}>{pending}</div>
                                <div style={styles.statLabel}>대기 중</div>
                            </div>
                        </div>
                    </>
                )}

                {currentSection === 'tasks' && (
                    <div style={styles.tasksContainer}>
                        <h2 style={styles.h2}>프로젝트 작업 리스트</h2>

                        <div style={styles.taskFilter}>
                            {['all', 'pending', 'inprogress', 'completed'].map(filter => (
                                <button
                                    key={filter}
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
                                    <div key={task.id} style={styles.taskItem}>
                                        <div style={styles.taskHeader}>
                                            <div>
                                                <div style={styles.taskTitle}>{task.title}</div>
                                                <div style={styles.taskDescription}>{task.description}</div>
                                            </div>
                                            <span style={{...styles.taskStatus, ...styles[getStatusClass(task.status)]}}>
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
                    <div style={styles.tasksContainer}>
                        <h2 style={styles.h2}>프로젝트 진행률</h2>

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
            </div>

            <footer style={styles.footer}>
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
};
