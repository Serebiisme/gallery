require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

let yeomanImage = require('../images/yeoman.png');

//图片路径
var imageDatas = require('../data/imageDatas.json');
//路径生成函数
imageDatas = (function genImageUrl(imageDatasArr){
  for (var i=0,j = imageDatasArr.length;i<j;i++){
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require("../images/" + singleImageData.fileName)

    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

//imageDatas = genImageUrl(imageDatas);  (采用自执行函数，如上)

//获取区间内的一个随机值
function getRangeRandom(low,high){
  //这里说的是向下取整   ---？？？？？
  return Math.ceil(Math.random() * (high - low) + low);
}

//获取0~30度之间的一个任意正负值
function get30DegRandom(){
  return ((Math.random() > 0.5 ? '':'-') + Math.ceil(Math.random() * 30));
}

class AppComponent extends React.Component {
  constructor(props){
    super(props);
    //存储排布的可取值范围
    this.state = {
      imgsArrangeArr:[
        /*{
          pos:{
            left:'0',
            top:'0'
          },
          rotate:0,  //图片的旋转角度
          isInverse:false,  //图片正反面
          isCenter:false  //图片是否居中
        }*/
      ]
    }

    this.Constant = {
      //中心图片排布
      centerPos:{
        left:0,
        right:0,        //?????top???
        top:0
      },
      //水平方向取值范围
      hPosRange:{
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      //垂直方向的取值范围
      vPosRange:{
        x:[0,0],
        topY:[0,0]
      }
    }
  }

  //组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {
    //拿到舞台大小
    var stageDOM = ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDOM.scrollWidth,
        stageH = stageDOM.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    //拿到一个imageFigure的大小
    
    var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDOM.scrollWidth,
        imgH = imgFigureDOM.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    //计算中心图片的位置点
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    };

    //计算左右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = - halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = - halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    //上侧区域的取值范围
    this.Constant.vPosRange.topY[0] = - halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);  //初始化第1张开始居中
  }

  /*
   * 翻转图片
   * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
   * @return {function} 闭包函数，其内return一个真正待被执行的函数
   */
  inverse(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr:imgsArrangeArr
      });  

    }.bind(this);
  }

    /*
   * 利用rearrange,居中对应ingdex的图片
   * @param index,需要被居中的图片对应的图片信息数组的index值
   * @return {function} 
   */
  center(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  }


  /*
   * 图片布局函数
   * @param centerIndex  指定居中排布哪个图片
   */
  rearrange(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        //用来存储部署在上册的图片信息，取0个或者1个
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),
        topImgSpliceIndex = 0,   //标记布局在上侧区域的图片来自数组对象的哪个位置
        
        //存放居中图片的状态信息
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

        //首先居中 centerIndex 的图片
        imgsArrangeCenterArr[0].pos = centerPos;
        //居中的 centerIndex 的图不需要旋转
        imgsArrangeCenterArr[0].rotate = 0;
        imgsArrangeCenterArr[0].isCenter = true;



        // 取出要布局上侧的图片的状态信息   --??????????????????????????--floor做了向下取整
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function(value,index){
          imgsArrangeTopArr[index].pos = {
            top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
            left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
          };
          imgsArrangeTopArr[index].rotate = get30DegRandom();
          imgsArrangeTopArr[index].isCenter = false;
        });

        //布局两侧的图片
        for(var i = 0 ,j = imgsArrangeArr.length ,k = j / 2 ; i < j ;i++){
          var hPosRangeLORX = null;

          //前半部分布局左边，右半部分布局右边
          if(i < k){
            hPosRangeLORX = hPosRangeLeftSecX;
          }else{
            hPosRangeLORX = hPosRangeRightSecX;
          }

          imgsArrangeArr[i].pos = {
            top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
            left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
          };
          imgsArrangeArr[i].rotate = get30DegRandom();
          imgsArrangeArr[i].isCenter = false;

        };

        //塞回取出的上侧图片
        if (imgsArrangeTopArr && imgsArrangeTopArr[0]){
          imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

        this.setState({
          imgsArrangeArr:imgsArrangeArr
        });

  }
  
  //渲染函数
  render() {

    //包含一系列图片和控制组件
    var controllerUnits = [],
        imgFigures = [];

    //遍历imageDatas,
    imageDatas.forEach(function(value,index) {

      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        };
      }

      imgFigures.push(<ImgFigure 
          key={index} 
          data={value} 
          ref={"imgFigure" + index} 
          arrange={this.state.imgsArrangeArr[index]} 
          inverse={(this.inverse(index))}
          center={this.center(index)}
          />);

      controllerUnits.push(<ControllerUnit
          key={index} 
          arrange={this.state.imgsArrangeArr[index]} 
          inverse={this.inverse(index)}
          center={this.center(index)}
          />);
    }, this);  //.bind(this)  ??

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

class ImgFigure extends React.Component{

  /*
   * imgFigure点击处理函数 
   */
  handleClick(e){
    //alert(0);
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }
    //this.props.inverse();
    //alert(this.props.inverse);
    e.stopPropagation();
    e.preventDefault();
  };

  render(){

    var styleObj = {};
    //如果props属性中指定了这张图片的位置，则使用
    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    if (this.props.arrange.rotate){
      //适配浏览器
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function(value){
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
      // styleObj['transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
    }

    // 如果是居中的图片， z-index设为11
    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";

    return (
      <figure className={imgFigureClassName} style={styleObj}
              onClick={this.handleClick.bind(this)}
              //onClick={alert(0)}
      >
        <img src={this.props.data.imageURL}
             alt={this.props.data.title}
        />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick.bind(this)}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
}

class ControllerUnit extends React.Component {

   /*
   * Unit点击处理函数 
   */
  handleClick(e){

    //如果点击的是当前正在选中的图，则翻转，否则居中
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }
    else{
      this.props.center();
    }

    e.stopPropagation();
    e.preventDefault();
  };

  render(){
    var ControllerUnitClassName = "controller-unit";

    //如果对应的是居中的图片，显示控制按钮的居中态
    if (this.props.arrange.isCenter){
      ControllerUnitClassName += " is-center";
      if (this.props.arrange.isInverse){
        ControllerUnitClassName += " is-inverse";
      }
    }
    return (
      <span className={ControllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
    );
  }
}



export default AppComponent;
