import React, { Component } from 'react';
import './Styles/CListStyle.css';
import {
    Link
} from "react-router-dom";

export default class CompetitionList extends Component {        // Страница со списком соревнований
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            competitions: [],
            searchTerm: ""
        };
    }

    componentDidMount() {
        var ApiKey = '';        // Введите свой апи ключ
        const headers = { 'X-Auth-Token': ApiKey}
        fetch('http://api.football-data.org/v2/competitions?plan=TIER_ONE', { headers })
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState(
                        {
                            isLoaded: true,
                            competitions: result.competitions
                        }
                    )
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                }
            );
    }

    render() {
        const {error, isLoaded, competitions, searchTerm} = this.state;
        var search = this.props.location.search; // Условие поиска принимает в качестве строки всю адресную строку целиком
        search = search.split("=")[1];  // В условии поиска остаётся только часть после знака "=", что соответствует запросу пользователя 
        if (search == null) {search=""} // Занесение пустой строки в условие поиска, во избежание крашей из-за null
        if (error) {
            return <p> Error {error.message}</p>
        } 
        else if (!isLoaded) {
            return <p> loading... </p>
        }
        else {
            return (
                <div className='List'>
                    <input className="CompetitionInput" type="text" placeholder="Найти соревнование..." onChange ={ Event => {this.setState({searchTerm: (Event.target.value)});}}/> 
                    <Link to={`/?q=${searchTerm}`} >
                        <button className='CompetitionCardButton'>Найти</button>
                    </Link>
                    <div className='ListOfCompetition'>
                        {competitions.filter((competition)=> {
                            if ( search == ""){
                                return competition
                            } else if ( competition.name.toLowerCase().includes(search.toLowerCase())) {    //Сравнение имени текущего элемента с поисковым запросом, обе строки в нижнем регистре
                                return competition
                            }                            
                        }).map(competition => (
                            <div key={competition.name} className='CompetitionCard' >
                                <p>{competition.name}</p>
                                <p>Место проведения: {competition.area.name}</p>
                                <p>Дата начала: {competition.currentSeason.startDate}</p>
                                <p>Дата окончания: {competition.currentSeason.endDate}</p>
                                <div className='CompetitionCardButtons'>
                                    <Link to={`/Teams/${competition.id}`} >
                                        <button className='CompetitionCardButton'>Список команд соревнования</button>
                                    </Link>
                                    <Link to={`/CompetitionMatches/${competition.id}`}>
                                        <button className='CompetitionCardButton'>Календарь матчей соревнования</button>
                                    </Link>
                                </div>    
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    }
}
/**/