import React from "react";
import fetch from "cross-fetch";
import { cleanup, fireEvent, screen, render } from "@testing-library/react";
import Login from "./../src/modules/Login";

import { ApolloProvider } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { ApolloLink } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { split, HttpLink } from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";

import { BrowserRouter } from "react-router-dom";

import { ConfigProvider } from "antd";
import ru_RU from "antd/lib/locale/ru_RU";

import constants from "./../src/config/constants";

Object.defineProperty(window, "matchMedia", {
	value: () => {
		return {
			matches: false,
			addListener: () => {},
			removeListener: () => {},
		};
	},
});

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

let pageRender = null; 

//Рендерим компонент `Login`
beforeEach(() => {
	const errorLink = onError(
		({ graphQLErrors, networkError, operation, response }) => {
			if (graphQLErrors)
				graphQLErrors.map(({ message, locations, path }) => {
					console.log(
						`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
							locations
						)}, Path: ${path}. \n`,
						`[Details]: operation: ${JSON.stringify(operation.variables)}. \n`,
						`[Details]: operationName: ${JSON.stringify(
							operation.operationName
						)}. \n`
					);
				});
		}
	);

	let { port, graphql } = constants;

	// настройка Apollo Client
	//// для запросов
	const httpLink = new HttpLink({
		uri: `https://` + window.SERVER_DATA + `:${port}${graphql.path}`,
		fetch,
	});
	//// для подписок
	const wsLink = new WebSocketLink({
		uri: `wss://` + window.SERVER_DATA + `:${port}${graphql.path}`,
		options: {
			reconnect: true,
		},
	});

	//// добавдение данных в заголовок запроса(POST)
	const authLink = setContext((_, { headers }) => {
		// get the authentication token from local storage if it exists
		const token = localStorage.getItem("token");
		// return the headers to the context so httpLink can read them
		return {
			headers: {
				...headers,
				authorization: token ? `Bearer ${token}` : "",
			},
		};
	});

	//// объединение вышеперечисленного
	const splitLink = split(
		({ query }) => {
			const definition = getMainDefinition(query);
			return (
				definition.kind === "OperationDefinition" &&
				definition.operation === "subscription"
			);
		},
		wsLink,
		authLink.concat(httpLink)
	);

	// инициализация клиента
	const client = new ApolloClient({
		link: ApolloLink.from([errorLink, splitLink]),
		cache: new InMemoryCache(),
		connectToDevTools: true,
	});

	//Совершаем рендер компонента
	pageRender = render(
		<BrowserRouter>
			<ApolloProvider client={client}>
				<ConfigProvider locale={ru_RU}>
					<Login />
				</ConfigProvider>
			</ApolloProvider>
		</BrowserRouter>
	);
});

describe("Тестируем компонент `[Login]`", () => {
	it("Проверка на наличия надписи `АВТОРИЗАЦИЯ`", async () => {
		//const contain = await screen.getElementsByClassName("authorizationHeader");
		// expect(contain.length).toBe(1)
		const contain = await screen.findAllByText("АВТОРИЗАЦИЯ");
		expect(contain[0].innerHTML).toBe("АВТОРИЗАЦИЯ");
	});

	it("Проверка на наличия кнопки `Войти`", async () => {
		const contain = await screen.findAllByText("Войти");
		expect(contain[0].innerHTML).toBe("Войти");
	});

	it("Проверка на наличия поля ввода `Имя пользователя`", async () => {
		const contain = await screen.getByPlaceholderText(/Имя пользователя/i);
		expect(contain.classList[0]).toBe("ant-input");
		expect(contain.classList[1]).toBe("loginFormName");
	});

	it("Проверка на наличия поля ввода `Пароль`", async () => {
			const contain = await screen.getByPlaceholderText(/Пароль/i);
			expect(contain.classList[0]).toBe("ant-input");
		});

	it("Печатаем в поля ввода `Имя пользователя` Текст `admin` ", async () => {

		const contain = await screen.getByPlaceholderText(/Имя пользователя/i);
		fireEvent.change(contain,{target: {value:"admin"}})
		expect(contain.value).toBe('admin')
	});

	it("Печатаем в поля ввода `Пароль` Текст `Пароль` ", async () => {

		const contain = await screen.getByPlaceholderText(/Пароль/i);
		fireEvent.change(contain,{target: {value:"1447"}})
		expect(contain.value).toBe('1447')
	});
});
