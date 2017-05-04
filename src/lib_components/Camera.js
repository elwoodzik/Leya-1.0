import _ObjectSettings from './_ObjectSettings';
import Rectangle from './Rectangle';

class Camera extends _ObjectSettings {

    AXIS = {
        NONE: "none",
        HORIZONTAL: "horizontal",
        VERTICAL: "vertical",
        BOTH: "both"
    }

    constructor(game, xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight) {
        super();

        this.initializeGlobalSettings({
            game: game,
            pooled: false,
            context: 'main',
            x: 1,
            y: 1,
            key: null,
            width: 0,
            height: 0
        });

        this.type = 'CAMERA'

        this.static = true;

        this.xScroll = xView || 0;
        this.yScroll = yView || 0;

        this.xDeadZone = 0; // min distance to horizontal borders
        this.yDeadZone = 0; // min distance to vertical borders

        this.wView = canvasWidth;
        this.hView = canvasHeight;

        this.axis = Camera.AXIS.BOTH;

        this.followed = null;

        this.viewportRect = new Rectangle(this.xScroll, this.yScroll, this.wView, this.hView);

        this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
    }

    update(dt) {
        this.moveToPointHandler();
        if (this.followed != null) {
            if (this.axis === Camera.AXIS.HORIZONTAL || this.axis === Camera.AXIS.BOTH) {
                // moves camera on horizontal axis based on followed object position
                if (this.followed.renderX - this.xScroll + this.xDeadZone > this.wView)
                    this.xScroll = this.followed.x - (this.wView - this.xDeadZone);
                else if (this.followed.renderX - this.xDeadZone < this.xScroll)
                    this.xScroll = this.followed.x - this.xDeadZone;
            }

            if (this.axis === Camera.AXIS.VERTICAL || this.axis === Camera.AXIS.BOTH) {
                // moves camera on vertical axis based on followed object position
                if (this.followed.renderY - this.yScroll + this.yDeadZone > this.hView)
                    this.yScroll = this.followed.y - (this.hView - this.yDeadZone);
                else if (this.followed.renderY - this.yDeadZone < this.yScroll)
                    this.yScroll = this.followed.y - this.yDeadZone;
            }
        }

        this.viewportRect.set(this.xScroll, this.yScroll);

        if (!this.viewportRect.within(this.worldRect)) {

            if (this.viewportRect.left < this.worldRect.left)
                this.xScroll = this.worldRect.left;
            // if(this.viewportRect.top < this.worldRect.top)					
            //     this.yScroll = this.worldRect.top;
            if (this.xScroll >= this.game.portViewWidth - this.game.width)
                this.xScroll = this.game.portViewWidth - this.game.width
            if (this.yScroll < 0)
                this.yScroll = 0;
            if (this.yScroll > this.game.portViewHeight - this.game.height)
                this.yScroll = this.game.portViewHeight - this.game.height;

        }
        this.game.physic.outOfScreen(this.game.gameObject)
    }

    follow(gameObject, xDeadZone, yDeadZone) {
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    }

    moveToPoint(x, y, speed, callback) {
        this.positionToMoveX = Math.floor(x);
        this.positionToMoveY = Math.floor(y);
        this.positionSpeed = speed;
        this.followed = null;
        this.moveTo = true;

        this.positionCallback = callback;
    }

    moveToPointHandler() {
        if (this.moveTo) {

            this.myX = Math.floor(this.xScroll + this.wView / 2);
            this.myY = Math.floor(this.yScroll + this.hView / 2);

            if (this.moveTo && (this.myX != this.positionToMoveX || this.myY != this.positionToMoveY)) {
                this.xScroll -= (((this.myX - this.positionToMoveX) / this.positionSpeed));
                this.yScroll -= (((this.myY - this.positionToMoveY) / this.positionSpeed));
            } else if (this.moveTo) {
                this.xScroll = Math.floor(this.xScroll)
                this.yScroll = Math.floor(this.yScroll)
                this.moveTo = false;

                if (typeof this.positionCallback === 'function') {
                    this.positionCallback.call(this.game, this);
                }
            }

            if (!this.viewportRect.within(this.worldRect)) {
                if (this.xScroll <= 0)
                    this.positionToMoveX = this.myX
                // if(this.viewportRect.top < this.worldRect.top)					
                //     this.yScroll = this.worldRect.top;
                // if(this.xScroll >= this.game.portViewWidth-this.game.width )
                //      this.positionToMoveX = this.myX
                if (this.yScroll < 0)
                    this.positionToMoveY = this.myY
                if (this.yScroll > this.game.portViewHeight - this.game.height)
                    this.positionToMoveY = this.myY
            }
        }
    }
};

export default Camera;