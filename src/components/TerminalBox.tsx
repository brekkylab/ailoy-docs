export default function TerminalBox({ children }: { children: string }) {
  return (
    <div style={{
      borderRadius: '10px',
      overflow: 'hidden',
      boxShadow: '0 0 10px rgba(0,0,0,0.2)',
      fontFamily: 'Menlo, Consolas, monospace',
      marginBottom: '1rem',
    }}>
      <div style={{
        background: '#ddd',
        padding: '0.5rem',
        display: 'flex',
        gap: '0.5rem',
      }}>
        <span style={{ width: '12px', height: '12px', background: '#ff5f56', borderRadius: '50%' }} />
        <span style={{ width: '12px', height: '12px', background: '#ffbd2e', borderRadius: '50%' }} />
        <span style={{ width: '12px', height: '12px', background: '#27c93f', borderRadius: '50%' }} />
      </div>
      <pre style={{
        background: '#1e1e1e',
        color: '#d4d4d4',
        margin: 0,
        padding: '1rem',
        whiteSpace: 'pre-wrap',
        fontSize: '0.9rem',
      }}>
        {children}
      </pre>
    </div>
  );
}
