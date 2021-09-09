import React, { Component } from 'react'
import './Styles/TeamMatchesStyle.css';
import {Link} from "react-router-dom";
import {compareAsc} from 'date-fns'

export default class TeamMatches extends Component {            // Страница со списком матчей определённой, по id, команды

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            matches: [],
            searchTermStart: "2000.1.1",    //Дефолтные значения в условиях поиска, при которых показаны все элементы Апи
            searchTermEnd: "2100.1.1"
        };
    }

    componentDidMount() {
        var ApiKey = '';    // Введите свой апи ключ
        const headers = { 'X-Auth-Token': ApiKey }
        fetch(`http://api.football-data.org/v2/teams/${this.props.match.params.id}/matches/`, { headers })
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState(
                        {
                            isLoaded: true,
                            matches: result.matches
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
        const {error, isLoaded, matches, searchTermStart, searchTermEnd} = this.state;
        var arrDate ="";
        var res1,res2 = 0;
        var compareDate = new Date();
        var search = this.props.location.search;    // Условие поиска принимает в качестве строки всю адресную строку целиком
        search = search.split("=")[1];  // В условии поиска остаётся только часть после знака "=", что соответствует запросу пользователя 
        if (search == null) {search = "2000.1.1/2023.1.1"}  // Занесение дефолтных данных в условие поиска, во избежание крашей из-за null
        var search1 = search.split("/")[0].split(".");  // Разделение даты занесённой в поиск для правильного перевода в Date Object 
        var search2 = search.split("/")[1].split(".");
        var searchStart = new Date (search1[0],search1[1],search1[2]);
        var searchEnd = new Date (search2[0],search2[1],search2[2]);
        if (error) {
            return <p> Error {error.message}</p>
        } 
        else if (!isLoaded) {
            return <p> loading... </p>
        }
        else {
            return (
                <div className="List">
                    <div className="MatchFilter">
                        <div className="FilterName">
                            Фильтр по дате
                        </div>
                        <div className="FilterInputs">
                            <div >
                                Введите первую дату
                                <input className="FilterInput" placeholder="гггг.мм.дд" onChange ={Event => {this.setState({searchTermStart: new Date(Event.target.value)})}}/>  
                            </div>
                            <div >
                                Введите вторую дату
                                <input className="FilterInput" placeholder="гггг.мм.дд" onChange ={Event => {this.setState({searchTermEnd: new Date(Event.target.value)})}}/>  
                            </div>
                        </div>    
                        <Link to={`/TeamMatches/${this.props.match.params.id}/?q=${searchTermStart}/${searchTermEnd}`} >
                            <button className="FilterButton"> Отсортировать </button>
                        </Link>                        
                    </div>
                    <div className='ListOfMatches'>
                        {matches.filter((match) => {
                            arrDate=(match.utcDate).split("T")[0].split("-");   //Превращение строки с датой текущего элемента апи, для перевода в Date Object 
                            compareDate = new Date(arrDate[0],arrDate[1],arrDate[2]);
                            res1 = compareAsc(compareDate,searchStart);
                            res2 = compareAsc(compareDate,searchEnd);
                           if (res1 == 1  && res2 == -1 ){  //Сравнение даты из текущего элемента с датой заданной в поиске
                            return match
                            }
                        }).map(match => (                            
                            <div key={match.id} className='MatchCard' >
                               <p>Матч соревнования: {match.competition.name}</p>
                                <p>Статус матча: {match.status}</p>
                                <p>Соперники: {match.homeTeam.name} против {match.awayTeam.name}</p>
                                <p>Финальный счёт: {match.score.fullTime.homeTeam} | {match.score.fullTime.awayTeam}</p>
                                <p>Дата проведения матча: {(match.utcDate).split("T")[0]}</p>
                                <p>Время проведения матча: {(match.utcDate).split("T")[1].split("Z")[0]}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )
        }
    } 
}
