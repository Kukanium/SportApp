import TeamsList from './Components/TeamsList';
import CompetitionList from './Components/CompetitionList';
import TeamMatches from './Components/TeamMatches';
import CompetitionMatches from './Components/CompetitionMatches';
import './Components/Styles/HeaderStyle.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  var ApiKey = "8aa65af1ad364c2aa79fe81e203342e6";
  return (
    <div className="App">      
      <Router>
        <Switch>
            <Route exact path="/" component={CompetitionList} />
            <Route path="/Teams/:id" component={TeamsList}/>
            <Route path="/TeamMatches/:id" component={TeamMatches}/>
            <Route path="/CompetitionMatches/:id" component={CompetitionMatches}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
