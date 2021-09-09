import React, { Component } from 'react'
import './Styles/TeamStyle.css';
import {
    Link
} from "react-router-dom";

export default class TeamsList extends Component { // Страница со списком команд определённого соревнования

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            teams: [],
            searchTerm: ""
        };
    }

    componentDidMount() {
        var ApiKey = '';    // Введите свой апи ключ
        const headers = { 'X-Auth-Token': ApiKey }
        fetch(`http://api.football-data.org/v2/competitions/${this.props.match.params.id}/teams/`, { headers })
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState(
                        {
                            isLoaded: true,
                            teams: result.teams,
                        }
                    )
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    })
                },

            );
    }

    render() {
        const {error, isLoaded, teams, searchTerm} = this.state;
        var search = this.props.location.search;    // Условие поиска принимает в качестве строки всю адресную строку целиком
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
                <div className="List">
                    <input className="TeamInput" type="text" placeholder="Найти команду..." onChange ={Event => {this.setState({searchTerm: (Event.target.value)})}}/>
                    <Link to={`/Teams/${this.props.match.params.id}/?q=${searchTerm}`} >
                        <button className='TeamListButton'>Найти</button>
                    </Link>
                    <div className='ListOfTeams'>
                        {teams.filter((team)=> {   
                            if ( search == ""){
                                return team
                            } else if ( team.name.toLowerCase().includes(search.toLowerCase())) {   //Сравнение имени текущего элемента с поисковым запросом, обе строки в нижнем регистре
                                return team
                            }                              
                        }).map(team =>
                        (                        
                            <div key={team.name} className='TeamCard' >
                                <p>Команда: {team.name}</p>
                                <p>Страна: {team.area.name}</p> 
                                <p>Год основания: {team.founded}</p>
                                <p>Сайт команды: {team.website}</p>
                                <p>Последняя игра: {(team.lastUpdated).split("T")[0]} | {(team.lastUpdated).split("T")[1].split("Z")[0]}</p>
                                <Link to={`/TeamMatches/${team.id}`} >                        
                                    <button className='TeamListButton'>
                                            Календарь матчей команды
                                    </button>
                                </Link>                                
                            </div>
                        ))}
                    </div>
                </div>
            )
            
        }
    }
}
