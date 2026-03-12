//=============================================================================
// _DEBUG_MODE_MV.js
//=============================================================================

/*:
 * @plugindesc デバッグモード
 * @author 
 * 
 * @param GetAllItems
 * @desc アイテムを全て入手するコマンドを表示
 * @default true
 * @type boolean
 * 
 * @param GetAllSkills
 * @desc スキルを全て習得するコマンドを表示
 * @default true
 * @type boolean
 * 
 * @param LevelMax
 * @desc レベルを最大値にするコマンドを表示
 * @default true
 * @type boolean
 *
 * @help デプロイメントしたデータでもデバッグ起動を可能にします。
 * 以下の機能があります
 * ・Ctrlキーで壁のすり抜け & エンカウント停止（デフォルトの仕様の場合）
 * ・「F9」でゲーム内フラグを変更
 *      - アイテム全入手、スキル全習得などの機能追加
 *      - プラグインによっては「スキル全習得」すると
 *        エラーが発生する場合があるので、
 *        その場合は該当項目をfalseにして下さい。選択できなくなります。
 */

(() => {
    'use strict';

    const getBooleanParam = function(param) {
        return param === "true";
    };

    const PARAMETERS = PluginManager.parameters('_DEBUG_MODE_MV');
    const GET_ALL_ITEM = getBooleanParam(PARAMETERS['GetAllItems']);
    const GET_ALL_SKILLS = getBooleanParam(PARAMETERS['GetAllSkills']);
    const LEVEL_MAX = getBooleanParam(PARAMETERS['LevelMax']);
    const ADDED_PARAM_NUM = 3;

    //--------------------------------------------
    //Game_Temp
    //--------------------------------------------
    Game_Temp.prototype.isPlaytest = function() {
        return true;
    };

    //--------------------------------------------
    //Scene_Debug
    //--------------------------------------------
    Scene_Debug.prototype.onRangeOk = function() {
        if (this._rangeWindow._isCheatIndex()) {
            this._exeCheat();
            this._rangeWindow.activate();
        } else {
            this._editWindow.activate();
            this._editWindow.select(0);
            this.refreshHelpWindow();
        }
    };

    const _Scene_Debug_refreshHelpWindow = Scene_Debug.prototype.refreshHelpWindow;
    Scene_Debug.prototype.refreshHelpWindow = function() {
        _Scene_Debug_refreshHelpWindow.call(this);
        if (this._rangeWindow._isCheatIndex()){
            const cheatIndex = this._rangeWindow._cheatIndex();
            const text = this._rangeWindow._getCheatInfo(cheatIndex)[3];
            this._debugHelpWindow.drawText(text, 4, 0);
        }
    };

    Scene_Debug.prototype._exeCheat = function() {
        const cheatIndex = this._rangeWindow._cheatIndex();
        const command = this._rangeWindow._getCheatInfo(cheatIndex)[2];
        switch(command) {
            case "ITEM":
                this._getAllItems();
                break;
            case "SKILL":
                this._getAllSkills();
                break;
            case "LEVEL":
                this._levelMax();
                break;
            default:
                return;
        }
        this.refreshHelpWindow();
    };

    Scene_Debug.prototype._getAllItems = function() {
        const n = 99;
        for (let i = 1; i < $dataItems.length; i++) {
            if ($dataItems[i].name !== "") {
                $gameParty.gainItem($dataItems[i], n);
            }
        }
        for (let i = 1; i < $dataWeapons.length; i++) {
            if ($dataWeapons[i].name !== "") {
                $gameParty.gainItem($dataWeapons[i], n);
            }
        }
        for (let i = 1; i < $dataArmors.length; i++) {
            if ($dataArmors[i].name !== "") {
                $gameParty.gainItem($dataArmors[i], n);
            }
        }
        $gameParty.gainGold(99999999);
    };

    Scene_Debug.prototype._getAllSkills = function() {
        for (let i = 1; i < $dataSkills.length; i++) {
            if ($dataSkills[i].name !== "") {
                $gameParty.members().forEach(function(actor) {
                    actor.learnSkill(i);
                });
            }
        }
    };

    Scene_Debug.prototype._levelMax = function() {
        $gameParty.members().forEach(function(actor) {
            actor.changeLevel(99, false);
        });
    };

    //--------------------------------------------
    //Window_DebugRange
    //--------------------------------------------
    Window_DebugRange.prototype.drawItem = function(index) {
        const rect = this.itemRectForText(index);
        let start = 0;
        let end = 0;
        let text = "";
        let isEnabled = true;
        const setEnd = (start) => {
            return start + 9;
        };
        const setAddedText = (start, end) => {
            return ' [' + start.padZero(4) + '-' + end.padZero(4) + ']';
        };

        if (index < this._maxSwitches) {
            start = index * 10 + 1;
            end = setEnd(start);
            text = 'S' + setAddedText(start, end);
        } else if (index < this._maxSwitches + this._maxVariables) {
            start = (index - this._maxSwitches) * 10 + 1;
            end = setEnd(start);
            text = 'V' + setAddedText(start, end);
        } else {
            let info = this._getCheatInfo(index - this.maxItems() + ADDED_PARAM_NUM);
            text = info[0];
            isEnabled = info[1];
        }
        this.changePaintOpacity(isEnabled);
        this.drawText(text, rect.x, rect.y, rect.width);
    };

    Window_DebugRange.prototype.maxItems = function() {
        return this._maxSwitches + this._maxVariables + ADDED_PARAM_NUM;
    };

    Window_DebugRange.prototype.mode = function() {
        if (this._isCheatIndex()) {
            return 'cheat';
        }
        return this.index() < this._maxSwitches ? 'switch' : 'variable';
    };

    Window_DebugRange.prototype._cheatIndex = function() {
        return this.index() - this.maxItems() + ADDED_PARAM_NUM;
    };

    Window_DebugRange.prototype._isCheatIndex = function() {
        return this._cheatIndex() >= 0;
    };

    Window_DebugRange.prototype.isCurrentItemEnabled = function() {
        if (!this._isCheatIndex()) {
            return true;
        }
        return this._getCheatInfo(this._cheatIndex())[1];
    };

    Window_DebugRange.prototype._getCheatInfo = function(cheatIndex) {
        //["コマンド名", 選択可能かどうか, "シンボル", "実行メッセージ"]
        switch(cheatIndex) {
            case 0:
                return ["アイテム全入手", GET_ALL_ITEM, "ITEM", "アイテムを全て入手しました"];
            case 1:
                return ["スキル全習得", GET_ALL_SKILLS, "SKILL", "スキルを全て習得しました"];
            case 2:
                return ["レベルMAX", LEVEL_MAX, "LEVEL", "レベルを最大値にしました"];
        }
        return ["Dummy", false, "Dummy", "Dummy"];
    };
    
    //--------------------------------------------
    //Window_DebugEdit
    //--------------------------------------------
    Window_DebugEdit.prototype.refresh = function() {
        this.contents.clear();
        if (!(this._mode === 'cheat')) {
            this.drawAllItems();
        }
    };

})();