import React from 'react';
import { PanResponder, View, Text, NativeModules, LayoutAnimation } from 'react-native';

import ChildView from './ChildView';

import {SCROLL_DIRECTION,SCROLL_STATE,PAGE_STATUS } from './Constants';
import DomHelper from './DomHelper';

const EXACT_PERCENT = 30;

const { UIManager } = NativeModules;

class ViewPager extends React.Component {
    constructor(props) {
        super(props);
        this.loop = true;
        this.direction  = SCROLL_DIRECTION.vertical;
        this.state = {
            width:  0,
            height: 0,
            pageIndex: 0,
            layout: false,
            transforms: {
                prev: { left: 0, top: 0, maskOpacity: 0, maskWidth: 0, maskHeight: 0},
                next: { left: 0, top: 0, maskOpacity: 0, maskWidth: 0, maskHeight: 0},
                current: { left: 0, top: 0, maskOpacity: 0, maskWidth: 0, maskHeight: 0}
            },
            scrollState: SCROLL_STATE.idle
        }
    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => this._onStart(evt, gestureState),
            onPanResponderMove: (evt, gestureState) => this._onMove(evt, gestureState),
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => this._onStop(evt, gestureState),
            onPanResponderTerminate: (evt, gestureState) => this._onStop(evt, gestureState),
            onShouldBlockNativeResponder: (evt, gestureState) => true
        });
    
        UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    genChildrenViews(children = []) {
        const EmptyView = <View><Text>No Content!</Text></View>;
        const length = children.length;
        const pageIndex = this.state.pageIndex;
        const { width, height, transforms, scrollState } = this.state;
        if(length===0) {
            return EmptyView;
        } 
        else if(length===1) {
            this.prevIndex = null;
            this.nextIndex = null;
            children[0].pageStatus = 'only';
            newChildren.push(React.createElement(ChildView,{
                pageStatus: 'only',
                width, height,
                direction: this.direction,
                index: 0,
                ...transforms.current
            }, children[0]));
        } 
        else {
            const loop = this.loop || !!this.props.loop;
            const direction = this.direction || !!this.props.direction;
            const prevIndex = pageIndex - 1;
            const nextIndex = pageIndex + 1;
            if(loop) {
                this.prevIndex = prevIndex = (prevIndex + length) % length;
                this.nextIndex = nextIndex = nextIndex % length;
            } else {
                this.prevIndex = prevIndex = prevIndex <= -1 ? null : prevIndex;
                this.nextIndex = nextIndex = nextIndex >= length ? null : nextIndex;
            }
            const newChildren = [];
            newChildren.push(React.createElement(ChildView,{
                ref: 'current',
                pageStatus: 'current',
                width, height,
                direction: this.direction,
                index: pageIndex,
                key: 'child'+pageIndex,
                ...transforms.current,
                scrollState
            }, children[pageIndex]));
            if(this.prevIndex!==null) {
                newChildren.push(React.createElement(ChildView,{
                    ref: 'prev',
                    pageStatus: 'prev',
                    width, height,
                    direction: this.direction,
                    index: prevIndex,
                    key: 'child'+prevIndex,
                    ...transforms.prev,
                    scrollState
                }, children[prevIndex]));
            }
            if(this.nextIndex!==null) {
                newChildren.push(React.createElement(ChildView,{
                    ref: 'next',
                    pageStatus: 'next',
                    width, height,
                    direction: this.direction,
                    index: nextIndex,
                    key: 'child'+nextIndex,
                    ...transforms.next,
                    scrollState
                }, children[nextIndex]));
            }
            return newChildren;
        }
    }
    _onLayout(event) {
        let {width, height} = event.nativeEvent.layout;
        const transforms = this.state.transforms;
        const isVertical = this.direction === SCROLL_DIRECTION.vertical;
        if(!this.state.layout) {
            transforms.current = {left: 0, top: 0, maskOpacity: 0, maskWidth: 0, maskHeight: 0};
            transforms.prev = {left: isVertical ? 0 : -width, top: isVertical ? -height: 0, maskOpacity: 0, maskWidth: width, maskHeight: height};
            transforms.next = {left: isVertical ? 0 : width, top: isVertical ? height: 0, maskOpacity: 0, maskWidth: width, maskHeight: height};
            this.setState({width, height, layout: true, transforms});
        }
    }
    _onStart(evt, gestureState) {
        if(this.state.scrollState!== SCROLL_STATE.idle) return;
        const scrollState = SCROLL_STATE.dragging;
        const {transforms} = this.state;
        this.refs.prev && this.refs.prev.setTransform(transforms.prev);
        this.refs.next && this.refs.next.setTransform(transforms.next);
        this.refs.current && this.refs.current.setTransform(transforms.current);
        this.setState({
            scrollState
        })
    }
    _onMove(evt, gestureState) {
        if(this.state.scrollState!== SCROLL_STATE.dragging) return;
        const { dx, dy } = gestureState;
        const { width, height, transforms } = this.state;

        if(this.direction === SCROLL_DIRECTION.horizontal) {
            transforms.current.maskOpacity = Math.abs(dx / width);
            transforms.current.maskWidth = width;
            transforms.current.maskHeight = height;
            transforms.next.left = width + dx;
            transforms.prev.left = -width + dx;
        } else {
            transforms.current.maskOpacity = Math.abs(dy / height);
            transforms.current.maskWidth = width;
            transforms.current.maskHeight = height;
            transforms.next.top = height + dy;
            transforms.prev.top = -height + dy;
        }

        this.refs.prev && this.refs.prev.setTransform(transforms.prev);
        this.refs.next && this.refs.next.setTransform(transforms.next);
        this.refs.current && this.refs.current.setTransform(transforms.current);

        console.log('onMove', transforms);
    }
    _onStop(evt, gestureState) {
        if(this.state.scrollState!== SCROLL_STATE.dragging) return;
        const scrollState = SCROLL_STATE.settling;
        this.settlingTime = this.props.settlingTime || 450;
        const { dx, dy } = gestureState;
        const direction = this.direction;
        const {width, height, transforms} = this.state;
        const isVertical = direction === SCROLL_DIRECTION.vertical;
        const percent = isVertical ? Math.abs(dy)*100 / height : Math.abs(dx)*100 / width;

        if(!isVertical) {
            isPrev = dx>0 && percent > EXACT_PERCENT;
            isNext = dx<0 && percent > EXACT_PERCENT;
            transforms.current.maskOpacity = (isPrev || isNext) ? Math.abs(dx / width) : 0;
            transforms.next.left = isNext ? 0 : width;
            transforms.prev.left = isPrev ? 0 : -width;
        } else {
            isPrev = dy>0 && percent > EXACT_PERCENT;
            isNext = dy<0 && percent > EXACT_PERCENT;
            transforms.current.maskOpacity = (isPrev || isNext) ? Math.abs(dy / height) : 0;
            transforms.next.top = isNext ? 0 : height;
            transforms.prev.top = isPrev ? 0 : -height;
        }
        LayoutAnimation.easeInEaseOut();
        this.setState({
            scrollState,
            transforms
        })

        setTimeout(()=>{
            const scrollState = SCROLL_STATE.idle;
            let pageIndex = this.state.pageIndex;
            if(isVertical) {
                if(dy > 0 && percent >= EXACT_PERCENT) pageIndex = this.prevIndex;
                else if(dy <0 && percent >= EXACT_PERCENT) pageIndex = this.nextIndex;
                else pageIndex = this.state.pageIndex;
            } else {
                if(dx > 0 && percent >= EXACT_PERCENT) pageIndex = this.prevIndex;
                else if(dx <0 && percent >= EXACT_PERCENT) pageIndex = this.nextIndex;
                else pageIndex = this.state.pageIndex;
            }

            transforms.current = {left: 0, top: 0, maskOpacity: 0, maskWidth: 0, maskHeight: 0};
            transforms.prev = {left: isVertical ? 0 : -width, top: isVertical ? -height: 0, maskOpacity: 0, maskWidth: width, maskHeight: height};
            transforms.next = {left: isVertical ? 0 : width, top: isVertical ? height: 0, maskOpacity: 0, maskWidth: width, maskHeight: height};
            this.setState({
                transforms,
                pageIndex,
                scrollState
            })
        }, this.settlingTime);
    }
    render() {
        const layout = this.state.layout;
        const children = this.genChildrenViews(this.props.children);
        return (<View {...this._panResponder.panHandlers} style={this.props.style} onLayout={(e)=>this._onLayout(e)}>
            {layout ? children : <Text>Loading</Text>}
        </View>)
    }
}

export default ViewPager;