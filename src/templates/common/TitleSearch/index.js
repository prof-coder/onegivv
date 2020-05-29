import React, { Component } from 'react'

class TitleSearch extends Component {

    state = {
        title: ''
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            title: nextProps.title
        });
    }

    handlekeyDownOnTitle = e => {
        if (e.keyCode === 13) {
			setTimeout(() => {
				this.props.update({
                    title: this.state.title
                })
			}, 300);
        } else {
            this.setState({
                title: e.target.value
            });
        }
    }
    
    render() {
        const { title } = this.state;
        const { inputId, className } = this.props;
        
        return (
            <div className={`input-control-wrapper ${className ? className : ''}`}>
                <input
                    className="filter-title control"
                    ref={input => {
                        this.textInput = input
                    }}
                    id={inputId && inputId}
                    value={title}
                    onChange={this.handlekeyDownOnTitle}
                    onKeyDown={this.handlekeyDownOnTitle}
                />
                <span className="icon-search"></span>
            </div>
        )
    }

}

export default TitleSearch