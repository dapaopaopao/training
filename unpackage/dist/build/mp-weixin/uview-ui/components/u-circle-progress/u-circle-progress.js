(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["uview-ui/components/u-circle-progress/u-circle-progress"],{2590:function(t,e,r){"use strict";var i=r("eba2"),n=r.n(i);n.a},"292f":function(t,e,r){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r={name:"u-circle-progress",props:{percent:{type:Number,default:0,validator:function(t){return t>=0&&t<=100}},inactiveColor:{type:String,default:"#ececec"},activeColor:{type:String,default:"#19be6b"},borderWidth:{type:[Number,String],default:14},width:{type:[Number,String],default:200},duration:{type:[Number,String],default:1500},type:{type:String,default:""},bgColor:{type:String,default:"#ffffff"}},data:function(){return{elBgId:"uCircleProgressBgId",elId:"uCircleProgressElId",widthPx:t.upx2px(this.width),borderWidthPx:t.upx2px(this.borderWidth),startAngle:-Math.PI/2,progressContext:null,newPercent:0,oldPercent:0}},watch:{percent:function(t){var e=this,r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;t>100&&(t=100),t<0&&(r=0),this.newPercent=t,this.oldPercent=r,setTimeout((function(){e.drawCircleByProgress(r)}),50)}},created:function(){this.newPercent=this.percent,this.oldPercent=0},computed:{circleColor:function(){return["success","error","info","primary","warning"].indexOf(this.type)>=0?this.$u.color[this.type]:this.activeColor}},mounted:function(){var t=this;setTimeout((function(){t.drawProgressBg(),t.drawCircleByProgress(t.oldPercent)}),50)},methods:{drawProgressBg:function(){var e=t.createCanvasContext(this.elBgId,this);e.setLineWidth(this.borderWidthPx),e.setStrokeStyle(this.inactiveColor),e.beginPath();var r=this.widthPx/2;e.arc(r,r,r-this.borderWidthPx,0,2*Math.PI,!1),e.stroke(),e.draw()},drawCircleByProgress:function(e){var r=this,i=this.progressContext;i||(i=t.createCanvasContext(this.elId,this),this.progressContext=i),i.setLineCap("round"),i.setLineWidth(this.borderWidthPx),i.setStrokeStyle(this.circleColor);var n=Math.floor(this.duration/100),o=2*Math.PI/100*e+this.startAngle;i.beginPath();var s=this.widthPx/2;if(i.arc(s,s,s-this.borderWidthPx,this.startAngle,o,!1),i.stroke(),i.draw(),this.newPercent>this.oldPercent){if(e++,e>this.newPercent)return}else if(e--,e<this.newPercent)return;setTimeout((function(){r.drawCircleByProgress(e)}),n)}}};e.default=r}).call(this,r("543d")["default"])},"2e8f":function(t,e,r){"use strict";var i;r.d(e,"b",(function(){return n})),r.d(e,"c",(function(){return o})),r.d(e,"a",(function(){return i}));var n=function(){var t=this,e=t.$createElement;t._self._c},o=[]},"86ed":function(t,e,r){"use strict";r.r(e);var i=r("2e8f"),n=r("df1b");for(var o in n)"default"!==o&&function(t){r.d(e,t,(function(){return n[t]}))}(o);r("2590");var s,a=r("f0c5"),c=Object(a["a"])(n["default"],i["b"],i["c"],!1,null,"a0c7b2a6",null,!1,i["a"],s);e["default"]=c.exports},df1b:function(t,e,r){"use strict";r.r(e);var i=r("292f"),n=r.n(i);for(var o in i)"default"!==o&&function(t){r.d(e,t,(function(){return i[t]}))}(o);e["default"]=n.a},eba2:function(t,e,r){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'uview-ui/components/u-circle-progress/u-circle-progress-create-component',
    {
        'uview-ui/components/u-circle-progress/u-circle-progress-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("86ed"))
        })
    },
    [['uview-ui/components/u-circle-progress/u-circle-progress-create-component']]
]);