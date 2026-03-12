var Saba;
(function (Saba) {
    Saba.applyMyMethods = function (myClass, presetClass, applyConstructor) {
        for (var p in myClass.prototype) {
            if (myClass.prototype.hasOwnProperty(p)) {
                if (p === 'constructor' && !applyConstructor) {
                    continue;
                }
                Object.defineProperty(presetClass.prototype, p, Object.getOwnPropertyDescriptor(myClass.prototype, p));
            }
        }
    };
})(Saba || (Saba = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
//=============================================================================
// Saba_BackLog.js
//=============================================================================
/*:ja
 * @author Sabakan
 * @plugindesc バックログを表示するプラグインです。
 *
 *
 * @param backLogButton
 * @desc バックログを表示するボタンです
 * @default pageup
 *
 * @param marginLeft
 * @desc 本文の左のスペースです。変更した場合、改行位置がずれる場合があります。
 * @default 70
 *
 * @param marginRight
 * @desc 本文の右のスペースです。変更した場合、改行位置がずれる場合があります。
 * @default 30
 *
 * @param nameLeft
 * @desc 名前の左のスペースです。
 * @default 20
 *
 * @param fontSize
 * @desc フォントサイズです。変更した場合、改行位置がずれる場合があります。
 * @default 24
 *
 * @param scrollSpeed
 * @desc カーソルキーでスクロールするときの速度です
 * @default 5
 *
 * @param windowHeight
 * @desc ウィンドウの高さです。大きいほど多く表示できます。
 * @default 2000
 *
 * @param maxLogCount
 * @desc ログを保存しておく最大数です
 * @default 50
 *
 * @param bottmMargin
 * @desc バックログウィンドウの下の空き空間です
 * @default 50
 *
 * @param logMargin
 * @desc ログとログの間の隙間です
 * @default 44
 *
 * @param windowSkin
 * @desc バックログ表示に使うウィンドウです
 * @default WindowBacklog
 * @require 0
 * @dir img/system/
 * @type file
 * @default 
 *
 * @param backOpacity
 * @desc 背景の透明度です
 * @default 230
 *  
 * @param backSprite
 * @desc 背景画像
 * @default 
 * @require 1
 * @dir img/pictures/
 * @type file
 *
 *
 * @help
 * Ver 2016-03-30 20:06:42
 *
 * テキストのバックログを表示するプラグインです。
 * 立ち絵スクリプトとの併用を想定しています。
 * 併用しない場合、独自に
 * $gameBackLog.addLog(name, message);
 * を呼ぶ必要があります。
 *
 */
var Saba;







(function (Saba) {





    var BackLog;
    (function (BackLog) {
        var parameters = PluginManager.parameters('Saba_BackLog');
        var backLogButton = parameters['backLogButton'];
        var scrollSpeed = parseInt(parameters['scrollSpeed']);
        var bottmMargin = parseInt(parameters['bottmMargin']);
        var windowHeight = parseInt(parameters['windowHeight']);
        var maxLogCount = parseInt(parameters['maxLogCount']);
        var fontSize = parseInt(parameters['fontSize']);
        var logMargin = parseInt(parameters['logMargin']);
        var marginLeft = parseInt(parameters['marginLeft']);
        var marginRight = parseInt(parameters['marginRight']);
        var nameLeft = parseInt(parameters['nameLeft']);
        var windowSkin = parameters['windowSkin'];
        var backOpacity = parseInt(parameters['backOpacity']);
        var backSprite = parameters['backSprite'];

        //unit_see追加　ｙの開始位置変更
        var yPlus = 110


        var Game_BackLog = (function () {
            function Game_BackLog() {
                this.logList = [];
            }
            Game_BackLog.prototype.addLog = function (name, message) {
                this.logList.push(new Game_TalkLog(name, message));
                if (this.logList.length >= maxLogCount) {
                    this.logList.shift();
                }
            };
            return Game_BackLog;
        }());
        var Game_TalkLog = (function () {
            function Game_TalkLog(name, message) {
                this.name = name;
                this.message = Window_Base.prototype.convertEscapeCharacters(message);
            }
            return Game_TalkLog;
        }());
        /**
         * バックログを表示するウィンドウクラスです。
         */
        var Window_BackLog = (function (_super) {
            __extends(Window_BackLog, _super);
            function Window_BackLog() {
                //unit_see調整
                _super.call(this, -5, 0, Graphics.width + 10, windowHeight - 110);
//              _super.call(this, -5, 0, Graphics.width + 10, windowHeight - 10);
                this._margin = -10;
                this._windowFrameSprite.visible = false;
                this.backOpacity = backOpacity;
                this.opacity = 0;
                this.contentsOpacity = 255;
                this._refreshBack();
                this.drawLogs();
            }



            Window_BackLog.prototype.loadWindowskin = function () {
                this.windowskin = ImageManager.loadSystem(windowSkin);
            };
            Window_BackLog.prototype.drawLogs = function () {
                //unit_see追加ｙ位置調整
                //var y = 0;
                var y = 0 + yPlus;
                for (var _i = 0, _a = BackLog.$gameBackLog.logList; _i < _a.length; _i++) {
                    var log = _a[_i];
                    y += this.drawLog(log, y);
                    y += this.logMargin();
                }
                console.log(windowHeight)
                if (y > windowHeight) {
                    this._maxHeight = windowHeight;
                    // 一回目の描画ではみだしていたら、はみ出す部分をけずって歳描画
                    var diff = y - windowHeight + bottmMargin;
                    while (true) {
                        if (BackLog.$gameBackLog.logList.length === 0) {
                            break;
                        }
                        var log = BackLog.$gameBackLog.logList.shift();
                        if (diff < log.y) {
                            break;
                        }
                    }
                    this.contents.clear();
                    y = 0;
                    for (var _b = 0, _c = BackLog.$gameBackLog.logList; _b < _c.length; _b++) {
                        var log = _c[_b];
                        y += this.drawLog(log, y);
                        y += this.logMargin();
                    }
                    this._maxHeight = y + bottmMargin;
                    if (this._maxHeight > windowHeight) {
                        this._maxHeight = windowHeight;
                    }
                    // 一番下までスクロールさせる
                    this.y = Graphics.height - this._maxHeight;
                }
                else {
                    this._maxHeight = y + bottmMargin;
                    if (this._maxHeight > windowHeight) {
                        this._maxHeight = windowHeight;
                    }
                    if (this._maxHeight < Graphics.height) {
                        this._maxHeight = Graphics.height;
                    }
                    this.y = Graphics.height - this._maxHeight;
                }
            };
            /**
             * ログをひとつ描画します
             * @param  {Game_TalkLog} log 描画するログ
             * @param  {number}       y   描画する y 座標
             * @return {number}           描画した高さ
             */
            Window_BackLog.prototype.drawLog = function (log, y) {
                console.log("test")
                this._lineCount = 1;
                var message = log.message;
                var height = 0;
                if (log.name) {
                    this.drawTextEx(log.name, nameLeft, y );
                    console.log(message.charAt(message.length - 1));
                    if (message.charAt(message.length - 1) === '。') {
                        message = message.substring(0, message.length - 1);
                    }
                    message = message + '」';
                    y += this.standardFontSize() + 8;
                    height = this.standardFontSize() + 8;
                    this.drawTextEx('「', marginLeft - this.standardFontSize(), y);
                }
                this.drawTextEx(message, marginLeft, y);
//                this.drawTextEx(message, marginLeft, y);
                height += this._lineCount * (this.standardFontSize() + 8);
                log.y = y + height + 150;
                return height;
            };
            Window_BackLog.prototype.processNewLine = function (textState) {
                this._lineCount++;
                _super.prototype.processNewLine.call(this, textState);
            };
            Window_BackLog.prototype.logMargin = function () {
                return logMargin;
            };
            Window_BackLog.prototype.textAreaWidth = function () {
                return this.contentsWidth() - marginRight;
            };
            Window_BackLog.prototype.update = function () {
                _super.prototype.update.call(this);
                if (Input.isPressed('down') || TouchInput.wheelY > 0) {
                    this.y -= scrollSpeed;
                    if (this.y < Graphics.height - this._maxHeight ) {
                        this.y = Graphics.height - this._maxHeight ;
                    }
                }
                else if (Input.isPressed('up') || TouchInput.wheelY < 0) {
                    this.y += scrollSpeed;
                    if (this.y > 0) {
                        this.y = 0;
                    }
                }
            };
            Window_BackLog.prototype.standardFontSize = function () {
                return fontSize;
            };
            Window_BackLog.prototype.backPaintOpacity = function () {
                return 128;
            };
            return Window_BackLog;
        }(Window_Base));



        //unit_see追加　画像読み込み
        var _Scene_Map_update = Scene_Map.prototype.update;
        var bitmap = ImageManager.loadBitmap("img/pictures/", backSprite);
        var sprite = new Sprite(bitmap);

        var bitmap2 = ImageManager.loadBitmap("img/pictures/", backSprite);
        var sprite2 = new Sprite(bitmap2);
        sprite2.setFrame(0, 0, 1300, 110);

        var bitmap3 = ImageManager.loadBitmap("img/pictures/", backSprite);
        var sprite3 = new Sprite(bitmap3);
        sprite3._createTinter(300, 300);
        sprite3.setFrame(0, 643, 1300, 300);
        sprite3.y = 643;

        Scene_Map.prototype.update = function () {
                if (this._windowBackLog) {
                    this._windowBackLog.update();
                                //unit_see追加ログの表示を抑制
                    if ($gameSwitches.value(214) == false) {

                        if (Input.isTriggered(backLogButton) || Input.isTriggered('cancel') || TouchInput.isCancelled() || TouchInput.isTriggered()) {


                            //unit_see追加　画像削除
                            this.removeChild(sprite3);
                            this.removeChild(sprite2);
                            this.removeChild(sprite);


                            this.removeChild(this._windowBackLog);
                            this._windowBackLog = null;
                            SoundManager.playCancel();
                        }

                        return;
                    }
                }
                _Scene_Map_update.call(this);
            //unit_see追加ログの表示を抑制
            if ($gameSwitches.value(214) == false) {

                if (Input.isTriggered(backLogButton) || BackLog.startWindowBackLog || TouchInput.wheelY < 0) {

                    //unit_see追加 画像表示
                    this.addChild(sprite);

                    BackLog.startWindowBackLog = false;
                    this._windowBackLog = new Window_BackLog();
                    SoundManager.playOk();
                    this.addChild(this._windowBackLog);

                    //unit_see追加 画像表示
                    this.addChild(sprite2);
                    this.addChild(sprite3);
                }
            }

        };
        var Scene_Boot_loadSystemImages = Scene_Boot.loadSystemImages;
        Scene_Boot.loadSystemImages = function () {
            Scene_Boot_loadSystemImages.call(this);
            if (windowSkin.length > 0) {
                ImageManager.loadSystem(windowSkin);
            }
        };
        var _Game_Message_add = Game_Message.prototype.add;
        Game_Message.prototype.add = function (text) {
            Saba.BackLog.$gameBackLog.addLog('', text);
            _Game_Message_add.apply(this, arguments);
        };
        BackLog.$gameBackLog = new Game_BackLog();
        BackLog.startWindowBackLog = false;
    })(BackLog = Saba.BackLog || (Saba.BackLog = {}));
})(Saba || (Saba = {}));