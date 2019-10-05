import React, { useState, useEffect } from 'react';
import connect from '@vkontakte/vk-connect';
import '@vkontakte/vkui/dist/vkui.css';
import './App.css';

import { Root, ScreenSpinner, Epic, Tabbar, TabbarItem, View, Snackbar, Avatar } from '@vkontakte/vkui';

import Icon28SettingsOutline from '@vkontakte/icons/dist/28/settings_outline';
import Icon28Newsfeed from '@vkontakte/icons/dist/28/newsfeed';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';

import Transport from './panels/Transport';
import Map from './panels/Map';
import Settings from './panels/Settings';



class App extends React.Component {
	constructor(props) {
		super(props);
		console.log(this.getUrlVars());
		this.state = {
			activeView: 'default',
			activeStory: 'transport',
			popout: <ScreenSpinner size='large' />,
			snackbar: null,
			urlVars: this.getUrlVars(),
			urlObj: this.objToQueryString(this.getUrlVars()),
			user: null,
			schedule: [],
			translations: {
				achievements: 'Достижения 1',
				need_accept_notifications: 'Надо разрешить уведомления',
				accept_notifications: 'Розрешить',

			}
		};
	}

	getUrlVars() {
		let urlVar = window.location.search;
		let dict = {};
		let arrayVar = (urlVar.substr(1)).split('&');
		if (arrayVar[0] === '') return false;
		for (let i = 0; i < arrayVar.length; i++) {
			let valueAndKey = arrayVar[i].split('=');
			dict[valueAndKey[0]] = valueAndKey[1];
		}
		return dict;
	}

	objToQueryString(obj) {
		const keyValuePairs = [];
		for (let i = 0; i < Object.keys(obj).length; i += 1) {
			keyValuePairs.push(`${encodeURIComponent(Object.keys(obj)[i])}=${encodeURIComponent(Object.values(obj)[i])}`);
		}
		return keyValuePairs.join('&');
	}

	componentDidMount() {
		fetch('https://demo135.bravo.vkhackathon.com/api/translations?vk_language=' + (this.state.urlVars['vk_language'] || 'ru'))
			.then(res => res.json())
			.then((data) => {
				this.setState({ translations: data });
			});

		console.log(this.state.urlVars);
		connect.subscribe((event) => {
			switch (event.detail.type) {
				case 'VKWebAppGetUserInfoResult':
					fetch(`https://demo135.bravo.vkhackathon.com/api/schedule?${this.state.urlObj}`)
						.then(res => res.json())
						.then((data) => {
							this.setState({
								schedule: data,
								user: event.detail.data
							});
						});
				case 'VKWebAppUpdateConfig':
					let schemeAttribute = document.createAttribute('scheme');
					schemeAttribute.value = event.detail.data.scheme ? event.detail.data.scheme : 'client_light';
					document.body.attributes.setNamedItem(schemeAttribute);
				default:
					break;
			}
			console.log('new message', event.detail.type, event.detail.data);

		});

		connect.send('VKWebAppGetAuthToken', {
			app_id: 7150429,
			scope: 'stories'
		});
		// connect.send('VKWebAppAllowNotifications', {});
		connect.send('VKWebAppAllowMessagesFromGroup', {
			group_id: 186987863,
			key: 'jopa'
		});

		window.connect = this.connect;

		this.setState({ popout: null });
	}

	onStoryChange = (e) => {
		this.setState({ activeStory: e.currentTarget.dataset.story });
	};

	go = (e) => {
		this.setState({ activeView: e.currentTarget.dataset.to })
	};

	onRemove = (index) => {
		fetch(`https://demo135.bravo.vkhackathon.com/api/schedule?${this.state.urlObj}&times=` + [...this.state.schedule.slice(0, index), ...this.state.schedule.slice(index + 1)].join(','), {method: 'POST'})
			.then(res => res.json())
			.then((data) => {
				console.log(data);
				this.setState({
					schedule: [...this.state.schedule.slice(0, index), ...this.state.schedule.slice(index + 1)]
				});
			});
	}

	render() {
		return (
			<Root activeView={this.state.activeView}>
				<Epic
					id='default'
					activeStory={this.state.activeStory}
					tabbar={
						<Tabbar>
							<TabbarItem
								onClick={ this.onStoryChange }
								selected={ this.state.activeStory === 'transport' }
								data-story='transport'
								text='Тренировки'
							>
								<Icon28Newsfeed />
							</TabbarItem>

							<TabbarItem
								onClick={ this.onStoryChange }
								selected={ this.state.activeStory === 'map' }
								data-story='map'
								text= {this.state.translations.achievements}
							>
								<Icon28FavoriteOutline />
							</TabbarItem>

							<TabbarItem
								onClick={ this.onStoryChange }
								selected={ this.state.activeStory === 'settings' }
								data-story='settings'
								text='Настройки'
							>
								<Icon28SettingsOutline />
							</TabbarItem>
						</Tabbar>
					}>
					<Transport id='transport' go={ this.go } />
					<Map id='map' />

					<Settings id='settings' user={ this.state.user } schedule={ this.state.schedule } go={ this.go } urlObj={ this.state.urlObj } blurred={ !Boolean(parseInt(this.state.urlVars['vk_are_notifications_enabled'])) } onRemove={ this.onRemove } />
				</Epic>

			</Root>
		);
	}
}

export default App;
