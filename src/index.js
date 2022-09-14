import React from 'react';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import './index.css';

import constants from "./config/constants";

import { ApolloProvider } from '@apollo/client';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import {
	DesktopOutlined,
	BarChartOutlined,
	DatabaseOutlined,
	ClockCircleOutlined
} from '@ant-design/icons';
import { ApolloLink } from '@apollo/client';
import { onError } from "@apollo/client/link/error";

import { split, HttpLink } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';

import { ConfigProvider, Layout, Row, notification, Button, Tooltip, Col } from 'antd';
import ru_RU from 'antd/lib/locale/ru_RU';
import {  Route, Redirect, Switch, BrowserRouter, useLocation, NavLink  } from 'react-router-dom';
import { accessRedirect, useUser } from "./core/functions";
import Header1 from "./core/Header1";
import Error404 from "./modules/Error404";
import Login from './modules/Login';
import AdminPanel from "./components/adminPanel/AdminPanel";
import Account from "./components/account/Account";
import DocumentControl from './components/DocumentControl/DocumentControl';
import DocumentSearch from './components/DocumentSearch/DocumentSearch'


	let { port, graphql } = constants;

	// настройка Apollo Client
	//// для запросов
	const httpLink = new HttpLink({
		uri: `https://` + window.SERVER_DATA + `:${port}${graphql.path}`
	});
	//// для подписок
	const wsLink = new WebSocketLink({
		uri: `wss://` + window.SERVER_DATA + `:${port}${graphql.path}`,
		options: {
			reconnect: true
		}
	});
	const { Header, Content, Sider } = Layout;
	// errors of above
	const errorLink = onError(({ graphQLErrors, networkError,operation,response }) => {
		if (graphQLErrors)
			graphQLErrors.map(({ message, locations, path }) => {
				console.log(
					`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}. \n`,
					`[Details]: operation: ${JSON.stringify(operation.variables)}. \n`,
					`[Details]: operationName: ${JSON.stringify(operation.operationName)}. \n`
				)
			}


			);

		if (networkError) {
			console.log(`[Network error]: ${JSON.stringify(networkError)}`);
			notification['info']({
				message: <div id="ant_notification">Ошибка соединения с сервером ZiK-Договора.
				<br />Обновите страницу. Если проблема не устранилась через 5 минут, свяжитесь с вашей службой IT.</div>,
				duration: 10, placement: 'bottomRight'
			})
		}
	});

	//// добавдение данных в заголовок запроса(POST)
	const authLink = setContext((_, { headers }) => {
		// get the authentication token from local storage if it exists
		const token = localStorage.getItem('token');
		// return the headers to the context so httpLink can read them
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : "",
			}
		}
	});
	//// объединение вышеперечисленного
	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === 'OperationDefinition' &&
				definition.operation === 'subscription'
			);
		},
		wsLink,
		authLink.concat(httpLink),
	);
	// инициализация клиента
	const client = new ApolloClient({
		link: ApolloLink.from([errorLink, splitLink]),
		cache: new InMemoryCache(),
		connectToDevTools: true
	});




	const documentControlP =
		<Col className='main-menu-col'>
			<Tooltip placement="rightTop" title="Документооборот">
				<Button type='solid' className="main-menu-button">
					<NavLink to="document-control" style={{ fontSize: "25px" }}>
						<DesktopOutlined style={{ marginRight: 7 }} />
						Договора 
						<p className='page-desc'>Организовывает движение документа</p>
					</NavLink>
				 </Button>
			</Tooltip>
		</Col>
	const documentReportP =
		<Col className='main-menu-col'>
			<Tooltip placement="rightTop" title="Отчеты">
				<Button type='solid' className="main-menu-button">
					<NavLink to="document-report" style={{ fontSize: "25px" }}>
						<BarChartOutlined style={{ marginRight: 7 }} />
						Отчеты 
						<p className='page-desc'>Получение отчетности по разделам</p>
					</NavLink>
				</Button>
			</Tooltip>
		</Col>
	const documentHistoryP =
		<Col className='main-menu-col'>
			<Tooltip placement="rightTop" title="Просмотр истории">
				<Button type='solid' className="main-menu-button">
					<NavLink to="document-history" style={{ fontSize: "25px" }}>
						<ClockCircleOutlined style={{ marginRight: 7 }} />
						История 
						<p className='page-desc'>Просмотр истории</p>
					</NavLink>
				</Button>
			</Tooltip>
		</Col>
	const documentSearchP =
		<Col className='main-menu-col'>
			<Tooltip placement="rightTop" title="Поиск по документам">
				<Button type='solid' className="main-menu-button"><NavLink to="document-search" style={{ fontSize: "25px" }}><DatabaseOutlined style={{ marginRight: 7 }} /> Поиск <p className='page-desc'>Поиск по документам</p></NavLink></Button>
			</Tooltip>
		</Col>



	let StartPage = React.memo(() => {
		const user = useUser();
		return (
			<Layout>
				<Header1 title={''} user={user} />
				<Layout>
					<Layout className="content-layout">
						<Content className="site-layout-background"
							style={{
								padding: 0,
								margin: 0,
								minHeight: 280
							}}>
							<div style={{ paddingTop: 50}}>
								<Row justify='center' style={{margin:"0",top:"50%", transform:"translate(0,-50%)",position:"absolute", width:"99%"}}>
									{user.documentControl.select ?
										documentControlP
										: null
									}
									{user.documentReport.select ?
										documentReportP
										: null
									}
									{user.documentHistory.select ?
										documentHistoryP
										: null
									}
									{user.documentSearch.select ?
										documentSearchP
										: null
									}
								</Row>
							</div>
						</Content>
					</Layout>
				</Layout>
			</Layout>
		)
	})

	let App = () => {

		return (
			<Switch>
				<Route path="/login" component={Login} />
				<Route path="/logout" component={() => { return <></> }} />
				<Route path="/" exact component={StartPage} />
				<Route path="/document-control" component={accessRedirect(DocumentControl)} />
				<Route path="/document-search" component={accessRedirect(DocumentSearch)} />
				<Route path="/admin" component={accessRedirect(AdminPanel)} />
				<Route path="/account" component={accessRedirect(Account)} />

				<Route component={Error404} />
				</Switch>
		)
	};

	ReactDOM.render(
		<BrowserRouter>
			<ApolloProvider client={client}>
				<ConfigProvider locale={ru_RU}>
					<App />
				</ConfigProvider>
			</ApolloProvider>
		</BrowserRouter>, document.getElementById('root'))