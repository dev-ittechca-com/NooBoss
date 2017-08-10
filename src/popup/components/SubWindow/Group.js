import React, { Component } from 'react';
import styled from 'styled-components';
import { Sunny, Groupy } from '../../../icons';
import { sendMessage, fileToDataURL, promisedSetDB } from '../../../utils';
import Selector from '../Selector';

const GroupDiv = styled.div`
	width: 100%;
	height: 100%;
	overflow-y: scroll;
	position: relative;
	cursor: initial;
	display: flex;
	&::-webkit-scrollbar-track{
		background: white;
	}
	&::-webkit-scrollbar{
		width: 5px;
	}
	&::-webkit-scrollbar-thumb{
		background: ${props => window.shared.themeMainColor};
	}
	#name{
		margin-top: 10px;
		font-size: 36px;
		height: 36px;
		width: 333px;
	}
	#selectedList{
		margin-top: 20px;
    height: 23px;
		img{
			width: 22px;
			height: 22px;
		}
	}
	#iconHolder{
		width: 109px;
		height: 1090px;
		display: block;
    position: absolute;
		top: 10px;
		right: 27px;
		cursor: pointer;
		#icon{
			max-width: 100%;
			max-height: 100%;
		}
		svg#icon{
			width: 100%;
			height: 100%;
		}
	}
`;

class Group extends Component{
	constructor(props) {
		super(props);
	}
	change(type, e) {
		const group = JSON.parse(JSON.stringify(this.props.group));
		switch (type) {
			case 'name':
				group.name = e.target.value;
				break;
			case 'selectExtension':
				const id = e;
				let index = group.appList.indexOf(id);
				if ( index == -1) {
					group.appList.push(id);
				}
				else {
					group.appList.splice(index, 1);
				}
				break;
		}
		sendMessage({ job: 'groupUpdate', group });
	}
	async updateIcon(e) {
		const file = (e.target.files || e.dataTransfer.files)[0];
		const dataURL = await fileToDataURL(file);
		const group = this.props.group;
		await promisedSetDB(group.id + '_icon', dataURL);
		sendMessage({ job: 'groupUpdate', group });
	}
	render() {
		const group = this.props.group;
		if (!group || (Object.keys(this.props.icons).length < Object.keys(this.props.groupList).length + Object.keys(this.props.extensions).length)) {
			return <GroupDiv><img id="loader" src="/images/icon_128.png" /></GroupDiv>;
		}
		const selectedList = (group.appList || []).map((id, index) => {
			const extension = this.props.extensions[id];
			return <img key={index} title={extension.name} src={this.props.icons[id + '_' + extension.version + '_icon']} />;
		});
		return (
			<GroupDiv>
				<section>
					<input id="name" onChange={this.change.bind(this, 'name')} value={group.name} />
					<input type="file" onChange={this.updateIcon.bind(this)} className="hidden" id="groupIconInput" accept="image/*" />
					<label id="iconHolder" htmlFor="groupIconInput">
						{this.props.icon ? <img id="icon" src={this.props.icon} /> : <Groupy id="icon" color={shared.themeMainColor} />}
					</label>
					<div id="selectedList">
						{selectedList}
					</div>
					<Selector
						icons={this.props.icons}
						updateSubWindow={this.props.updateSubWindow}
						extensions={this.props.extensions}
						selectedList={group.appList}
						select={this.change.bind(this, 'selectExtension')}
					/>
				</section>
			</GroupDiv>
		);
	}
}

export default Group;
