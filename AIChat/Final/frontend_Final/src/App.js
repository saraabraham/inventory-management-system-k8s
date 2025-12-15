import './styles/App.css';
import Navbar from './components/Navbar.jsx';
import ChatBody from './components/ChatBody.jsx';
import Resource from './components/Resource.jsx';
import ChatBot from './components/ChatBot.jsx';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <ChatBody />
                <Resource
                  icons={{
                    uniIcon: <img src="/assets/icons/uni.svg" alt="Uni" />,
                    jobIcon: <img src="/assets/icons/job.svg" alt="Job" />,
                    agencyIcon: <img src="/assets/icons/agency.svg" alt="Agency" />,
                    hrIcon: <img src="/assets/icons/hr.svg" alt="HR" />,
                    programIcon: <img src="/assets/icons/program.svg" alt="Program" />,
                    courseIcon: (
                      <img src="/assets/icons/course1.png" alt="Course" className="courseIcon" />
                    ),
                    supportIcon: <img src="/assets/icons/support.svg" alt="Support" />,
                    studentUnionIcon: <img src="/assets/icons/studentUnion.svg" alt="Student Union" />,
                    arrow: <img src="/assets/icons/drop2.svg" alt="arrow" />,
                    arrowCountry: <img src="/assets/icons/countryDropDown.svg" alt="arrow" />,
                  }}
                />
              </>
            }
          />

          {/* ChatBot Page */}
          <Route path="/chatbot" element={<ChatBot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
