import React from 'react';
import { StyleSheet, View } from 'react-native';

import {SCROLL_DIRECTION,SCROLL_STATE,PAGE_STATUS } from './Constants';
import DomHelper from './DomHelper';

const colors = ["#230091", '#4598f1', '#f18912']

class ChildView extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.state = {top: 0, left: 0, width: 0, height: 0, index: 0 , maskOpacity: 0, maskWidth: 0, maskHeight: 0}
    }

    setTransform(transform) {
        this.setState({
            ...transform
        })
    }
    
    render() {
        const {scrollState, index, width, height, pageStatus} = this.props;
        const transform = scrollState === SCROLL_STATE.dragging ? this.state : this.props;
        let { top, left, maskOpacity, maskWidth, maskHeight } = transform;
        if(pageStatus===PAGE_STATUS.next) console.log('next',transform);
        return (<View style={[styles.container, {top, left, width, height} ,{backgroundColor: colors[index]}]}>
            <View style={[styles.content, {width, height}]}>{this.props.children}</View>
            <View style={[styles.mask, {opacity: maskOpacity, width: maskWidth, height: maskHeight}]}></View>
        </View>)
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    },
    mask: {
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: 'rgb(0,0,0)',
        width: 0,
        height: 0
    }
})

export default ChildView;
