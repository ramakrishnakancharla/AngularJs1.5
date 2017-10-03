
'use strict';

angular.module('napierContainerUi')
.directive('drawComponent', function($window,$rootScope) {
    return {
        restrict: 'E',
        template: "<div class='customDirective'><div class='x_panel tile inline_block fixed_width_540 border_color clearfix'><div><div class='clearfix'></div><label style='margin-right:5px'><input style='margin-left:2px' ng-model='mode' value='draw' ng-change='modeChanged()' type='radio'/>Draw</label><label><input style='margin-left:2px' ng-model='mode' value='text' ng-change='modeChanged()' type='radio'/>Add Text</label><button class='btn btn-default' style='margin-left:10px;margin-right:10px' ng-disabled='arrElements.length==0' ng-click='undoAddition()'>Undo</button><button class='btn btn-default' style='margin-left:5px;margin-right:10px' ng-disabled='arrElements.length==0' ng-click='clearCanvas()'>Clear All</button><button class='btn btn-default pull-right' style='margin-left:5px;margin-right:10px'  ng-click='resetComponent()'>Reset</button></div><form name='canvasTextForm' class='row' width='100%' style='margin:2px;' uib-collapse='isCollapsed'><textarea ng-model='currentText' maxlength='200' class='col-md-9 col-sm-9 col-xs-9' style='margin-bottom:5px;'></textarea><button ng-click='addText()' ng-disabled='disableButton' style='margin-bottom:2px' class='btn btn-primary pull-right  col-md-2 col-sm-2 col-xs-2'>Add</button></form><div style='width:100%;position: absolute;'><canvas class='canvas_box_shadow' style='margin-top:5px;background-repeat: no-repeat;background-size: cover; width:100%'></canvas></div></div></div>",
        scope: {
            bgImage: '@',
			onLoadImage : '=',
			onLoadImageData : '=',
            control: '=',
            isUpload: '=' //,
                //changeBg: '@'
        },
        replace: true,
        link: function(scope, elem, attr) {
            scope.isCollapsed = true;
            scope.mode = 'draw';
            scope.disableButton = true;           
            scope.canvasId = "id-" + Math.round(10000 + Math.random() * 100000); 

            var canvas = elem.find("canvas")[0];
            angular.element(canvas).attr("id",scope.canvasId);
            var canvasId = canvas.id;
            var stage = new createjs.Stage(canvasId);
            if (scope.bgImage && scope.bgImage != '') {
                canvas.style.backgroundImage = "url('" + scope.bgImage + "')";
            }
            if (scope.isUpload == true) {}
            var oldPt;
            var oldMidPt;
            var title;
            var color;
            var stroke;
            var colors;
            var index;
            var shapeContainer;
            scope.arrElements = [];
            var isMouseDownOnText = false;
            var container = new createjs.Container();
            container.x = 0;
            container.y = 0;
            var backgroundShape = new createjs.Shape();
            backgroundShape.graphics.beginFill("#FFF").drawRect(-10, -10, this.width + 20, this.height);
            stage.addChild(container);
            this.canvasContainer = container;
            stage.autoClear = true;
            stage.update();
            stage.addEventListener("stagemousedown", handleMouseDown);
            stage.addEventListener("stagemouseup", handleMouseUp);
            stage.enableMouseOver();
            createjs.Ticker.setFPS(24);
            stage.mouseChildren = false;
            stage.mouseEnabled = false;
            var textBoxPoint;
            var selectedColor = scope.selectedColor = '#f00';

            scope.test = function() {
                
            }

            scope.$watch('currentText', function(value) {
                    if (value != undefined) {
                        if (value == '') {
                            scope.disableButton = true;
                        } else {
                            scope.disableButton = false;
                        }
                    }
                })
                //Toggle between draw and text mode
            scope.modeChanged = function() {
                if (scope.mode == 'draw' && !scope.isCollapsed) {
                    scope.isCollapsed = true;
                }
            }

            function handleMouseDown(event) {
                if (scope.mode != 'draw') {
                    return;
                }
                if (!event.primary) {
                    return;
                }
                color = (scope.selectedColor != '') ? scope.selectedColor : '#F00';
                stroke = 1;
                oldPt = new createjs.Point(stage.mouseX, stage.mouseY);
                oldMidPt = oldPt.clone();
                shapeContainer = new createjs.Container();
                shapeContainer.name = 'shape' + Math.round(Math.random() * 199);
                container.addChild(shapeContainer);
                stage.addEventListener("stagemousemove", handleMouseMove);
                stage.update();
            }


            function handleMouseUp(event) {
                if (scope.mode != "draw") {
                    console.log('coming inside');
                    //fetching the co-ordinates for adding text
                    scope.isCollapsed = false;
                    scope.$apply();
                    textBoxPoint = {
                        x: event.stageX,
                        y: event.stageY
                    }
                    return;
                }
                if (!event.primary) {
                    return;
                }
                scope.arrElements.push(shapeContainer);
                scope.$apply();
                stage.removeEventListener("stagemousemove", handleMouseMove);
                stage.update();
            }

            //Mouse move event
            function handleMouseMove(event) {
                if (!event.primary) {
                    return;
                }
                var midPt = new createjs.Point(oldPt.x + stage.mouseX >> 1, oldPt.y + stage.mouseY >> 1);
                var targetShape = new createjs.Shape();
                targetShape.graphics.clear().setStrokeStyle(stroke, 'round', 'round').beginStroke(color).moveTo(midPt.x, midPt.y).curveTo(oldPt.x, oldPt.y, oldMidPt.x, oldMidPt.y);

                oldPt.x = stage.mouseX;
                oldPt.y = stage.mouseY;

                oldMidPt.x = midPt.x;
                oldMidPt.y = midPt.y;
                shapeContainer.addChild(targetShape);

                stage.update();
            }

            //Adding text container to canvas
            scope.addText = function() {
                /*   if (me.backgroundImage !== undefined && me.backgroundImage !== null && me.backgroundImage !== '') {
                       if (description == '' || description == undefined) {
                           return;
                       }*/
                var textContainer = new createjs.Container();
                textContainer.name = 'textDesc';
                textContainer.mouseChildren = false;
                textContainer.cursor = 'pointer';
                var text = new createjs.Text(scope.currentText, "bold 10px Arial", scope.selectedColor);
                text.maxWidth = 120;
                text.lineWidth = 120;
                var textWidth = text.getMeasuredWidth();
                var textHeight = text.getMeasuredHeight();
                //  var target = new createjs.Shape();

                if (textWidth > 120) {
                    textWidth = 140;
                } else {
                    textWidth += 10;
                }

                //  target.graphics.beginFill("#000").drawRoundRect(textBoxPoint.x, textBoxPoint.y, textWidth, textHeight + 10, 8);


                text.x = textBoxPoint.x - textWidth / 2;
                text.y = textBoxPoint.y - textHeight / 2;
                container.addChild(textContainer);
                //  textContainer.addChild(target);
                textContainer.addChild(text);
                textContainer.addEventListener('mousedown', function(evt) {
                    isMouseDownOnText = true;
                });
                scope.arrElements.push(textContainer);
                var bounds = textContainer.getBounds();
                //Need to bring the pointer level
                textContainer.addEventListener("pressmove", function(evt) {
                    evt.target.x = evt.stageX - bounds.x;
                    evt.target.y = evt.stageY - bounds.y;
                    stage.update();
                });
                stage.update();
                scope.currentText = "";
            }

            //input file change event start
            scope.onSelect = function(e) {
                    scope.getBackgroundImage();
                }
                //input file change event end

                 scope.onClick = function(e) {
                   e.value=null;
                 }
                //making file value to null to enable selection of same image again and again


            //get image file function strat
            scope.getBackgroundImage = function() {
                    var file = elem.find('input[type="file"]')[0].files;
                    var fileToload = file[0];
                    var fileReader = new FileReader();
                    fileReader.onload = function(fileLoadedEvent) {
                        scope.backGroundImgSrcData = fileLoadedEvent.target.result;
                        scope.setBackgroundImage(scope.backGroundImgSrcData);
                    }
                    fileReader.readAsDataURL(fileToload);
                }
                //get image file function end

            //set background image file function start
            scope.setBackgroundImage = function(x) {
                    scope.backGroundImgSrcData = x;
                    elem.find('canvas').css("background-image", "url(" + x + ")");
                }
                //set background image file funciton end 
             scope.setBackgroundImage(scope.onLoadImage);
            scope.$on('colorpicker-closed', function(target, val) {
                target.currentScope.colorbox = {
                    'background-color': val.value
                }
                scope.$apply();
            })



            scope.undoAddition = function() {
                if (scope.arrElements.length > 0) {
                    var element = scope.arrElements.pop();
                    container.removeChild(element);
                    stage.update();
                }
            }


            scope.clearCanvas = function() {

                if (scope.arrElements.length !== 0) {
                    for (var i = 0; i < scope.arrElements.length; i++) {
                        container.removeChild(scope.arrElements[i]);
                    }
                    scope.arrElements = [];
                    stage.update();
                }
            }

          
            scope.resetComponent=function(){
                 scope.clearCanvas();
                 scope.backGroundImgSrcData = scope.onLoadImageData;
                 elem.find('canvas').css("background-image", "url(" +  scope.backGroundImgSrcData + ")");
                 scope.bgImage="";
                  } 
         
            scope.$watch('control', function() {

                scope.control.requireImageUpload = true;
                scope.control.clearCanvas = function() {
                    scope.clearCanvas();
                }

                scope.control.setBitmapData = function(imgData) {
                    if (imgData != null) {
                        var pngData = "data:image/png;base64," + imgData;
                        var bitmap = new createjs.Bitmap(pngData);
                        container.addChild(bitmap);
                        scope.arrElements.push(bitmap);
                        stage.update();
                    }
                }

                //Get the snapshot of the activity done on the canvas
                scope.control.getBitmapData = function() {
                    if (scope.arrElements.length !== 0) {
                        var canvasObj = document.getElementById(scope.canvasId);
                        var d = canvasObj.toDataURL("image/png");
                        var arr = d.split(",", 2);
                        return arr[1];
                    } else {
                        return null;
                    }
                }

                //get canvas background data
                scope.control.getBackgroundImage = function() {
                    if (scope.backGroundImgSrcData) {
                        var x = scope.backGroundImgSrcData.split(",", 2);
                        return x[1];
                    } else {
                        return null;
                    }

                }

                //set canvas background image
                scope.control.setBackgroundImage = function(x) {
                    if (x) {
                        var imageData = "data:image/png;base64," + x;
                        scope.setBackgroundImage(imageData);
                    }
                }

                scope.control.setBackgroundImageWithURL = function(x) {
                    if (x) {
                        scope.setBackgroundImage(x);
                    }
                }

              

            })
        },
    }
});
