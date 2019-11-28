import React from 'react';
import {Footer,  Div, Group, View, Button} from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';


import '../App.css';


const Settings = props => (
    <View id={ props.id } activePanel='default'>
        <Panel id='default'>
            <PanelHeader >
                Информация
            </PanelHeader>
            <Group title='О нас'>
                <Div>  <Button size="l"   component="a" href="https://vk.me/club187561580" >Написать разработчику</Button> </Div>
                <Div> <Button size="l" level="secondary" component="a" href="https://vk.com/club187561580" >Открыть сообщество</Button> </Div>
            </Group>
            <Footer>
                Информация взята с wikipedia.org и pitertransport.com
            </Footer>
        </Panel>
    </View>
);



export default Settings;
