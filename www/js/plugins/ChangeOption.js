//=============================================================================
// ChangeOption.js
//=============================================================================


//======プラグインの説明。
/*:
 * @plugindesc オプションのウィンドウ幅・項目を変更するプラグインです。
 * 
 * @author T753(なごみ)
 *
 *
 * @param Window Width
 * @desc オプションウィンドウの幅を変更します。
 * デフォルト：400
 * @type Number
 * @default 400
 *
 *
 * @param Always Dash
 * @desc オプションに『常時ダッシュ』を表示します。
 * 表記はデータベースの『用語』→『メッセージ』から変更します。
 * @type Boolean
 * @default true
 *
 *
 * @param Command Remember
 * @desc オプションに『コマンド記憶』を表示します。
 * 表記はデータベースの『用語』→『メッセージ』から変更します。
 * @type Boolean
 * @default true
 *
 *
 * @param Bgm Volume
 * @desc オプションに『BGM 音量』を表示します。
 * 表記はデータベースの『用語』→『メッセージ』から変更します。
 * @type Boolean
 * @default true
 *
 *
 * @param Bgs Volume
 * @desc オプションに『BGS 音量』を表示します。
 * 表記はデータベースの『用語』→『メッセージ』から変更します。
 * @type Boolean
 * @default true
 *
 *
 * @param Me Volume
 * @desc オプションに『ME 音量』を表示します。
 * 表記はデータベースの『用語』→『メッセージ』から変更します。
 * @type Boolean
 * @default true
 *
 *
 * @param Se Volume
 * @desc オプションに『SE 音量』を表示します。
 * 表記はデータベースの『用語』→『メッセージ』から変更します。
 * @type Boolean
 * @default true
 *
 * @help 『オプションの項目変更プラグイン』
 * このプラグインには、プラグインコマンドはありません。
 *
 * ■利用方法
 * 『プラグイン管理』で基本設定の状態を『ON』にすれば利用可能です。
 * パラメータの値を変更してください。
 * イベントの設定（プラグインコマンド）は不要です。
 * ※パラメータをすべて『false』にするとエラーになりますので、
 * 　ご注意ください。
 *
 * ■利用規約
 * このプラグインの改変、再配布は自由です。
 * クレジットの表記も不要です。
 *
 * ■MEMO
 * 2019/9/28 T753
 */


//======プラグインの中身。
(function () {

//===変数の定義。
    var parameters = PluginManager.parameters('ChangeOption');
    var windowWidth = Number(parameters['Window Width'] || 400);
    var alwaysDash = Boolean(parameters['Always Dash'] === 'true');
    var commandRemember = Boolean(parameters['Command Remember'] === 'true');
    var bgmVolume = Boolean(parameters['Bgm Volume'] === 'true');
    var bgsVolume = Boolean(parameters['Bgs Volume'] === 'true');
    var meVolume = Boolean(parameters['Me Volume'] === 'true');
    var seVolume = Boolean(parameters['Se Volume'] === 'true');

//===オプションウィンドウの幅を設定。
  Window_Options.prototype.windowWidth = function() {
    return windowWidth;
  };

//===オプションウィンドウに表示する項目の設定。
  Window_Options.prototype.makeCommandList = function() {
    this.addGeneralOptions();
    this.addVolumeOptions();
};

//===if～は変数によって表示／非表示を変更する。
  Window_Options.prototype.addGeneralOptions = function() {
    if(alwaysDash) {
      this.addCommand(TextManager.alwaysDash, 'alwaysDash');
    }
    if(commandRemember) {
      this.addCommand(TextManager.commandRemember, 'commandRemember');
    }
};

//===音量関係。
  Window_Options.prototype.addVolumeOptions = function() {
    if(bgmVolume) {
      this.addCommand(TextManager.bgmVolume, 'bgmVolume');
    }
    if(bgsVolume) {
      this.addCommand(TextManager.bgsVolume, 'bgsVolume');
    }
    if(meVolume) {
      this.addCommand(TextManager.meVolume, 'meVolume');
    }
    if(seVolume) {
      this.addCommand(TextManager.seVolume, 'seVolume');
    }
};

})();