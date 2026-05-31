import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import logo from './assets/logo.png';

function App() {
  return (
    <div className="app-wrapper">
      <div className="app-header">
        <div className="header-brand">
          <img src={logo} alt="VectorShift Logo" className="header-logo" />
          <div>
            <div className="header-title">VectorShift</div>
            <div className="header-subtitle">Pipeline Builder</div>
          </div>
        </div>
        <div className="header-right">
          <span className="header-badge">Assessment</span>
        </div>
      </div>
      
      <div className="main-layout">
        <PipelineToolbar />
        <PipelineUI />
      </div>

      <SubmitButton />
    </div>
  );
}

export default App;
