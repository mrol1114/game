
const SETTINGS = {
    width: 600,
    height: 600,
    canvasContext: null,
    fps: 1000/60,
    color: "#a0f06e"
};  

const PLAYER1 = {
    x: 0,
    y: 0,
    xDirection: 15,
    yDirection: 15,
    size: 30,
    color: 'blue',
    direction: 83,
    health: 3
};

const GUNPLAYER1 = {
    x: PLAYER1.x + 10,
    y: PLAYER1.y + PLAYER1.size,
    width: 10,
    height: 15,
    color: 'blue',
};

const PLAYER2 = {
    x: 570,
    y: 570,
    xDirection: 15,
    yDirection: 15,
    size: 30,
    color: 'red',
    direction: 37,
    health: 3
};

const GUNPLAYER2 = {
    x: PLAYER2.x - 15,
    y: PLAYER2.y + 10,
    width: 15,
    height: 10,
    color: 'red',
};

const BLOCK1 = {
    size: 150,
    x:SETTINGS.width/2,
    y:SETTINGS.height/2,
    color: "#964b00"

};

const BLOCK2 = {
    size: 80,
    x: 150,
    y: 520,
    color: "#964b00"
};

const BLOCK3 = {    
    size: 100,
    x: 500,
    y: 150,
    color: "#964b00"
};

const LAKE = {
    size: 60,
    x: 450,
    y: 250,
    color: "#007dff"
};

let bullets = [];

const GAME = {

    interval: null,
    heart1Player1: document.getElementById('heart1-player1'),
    heart2Player1: document.getElementById('heart2-player1'),
    heart3Player1: document.getElementById('heart3-player1'),
    heart1Player2: document.getElementById('heart1-player2'),
    heart2Player2: document.getElementById('heart2-player2'),
    heart3Player2: document.getElementById('heart3-player2'),

    gameInit: function()
    {
        let canvas = document.getElementById('canvas');
        GAME.initCanvas(canvas);
        GAME.interval = setInterval(GAME.play,SETTINGS.fps);
        GAME.eventListners();
    },

    initCanvas: function(canvas)
    {
        canvas.width = SETTINGS.width;
        canvas.height = SETTINGS.height;
        SETTINGS.canvasContext = canvas.getContext('2d');
    },

    draw: function()
    {
        SETTINGS.canvasContext.clearRect(0,0,SETTINGS.width, SETTINGS.height);

        SETTINGS.canvasContext.fillStyle = SETTINGS.color;
        SETTINGS.canvasContext.fillRect(0, 0, SETTINGS.width, SETTINGS.height);

        SETTINGS.canvasContext.fillStyle = BLOCK1.color;
        SETTINGS.canvasContext.fillRect(BLOCK1.x, BLOCK1.y, BLOCK1.size, BLOCK1.size);

        SETTINGS.canvasContext.fillStyle = BLOCK2.color;
        SETTINGS.canvasContext.fillRect(BLOCK2.x, BLOCK2.y, BLOCK2.size, BLOCK2.size);

        SETTINGS.canvasContext.fillStyle = BLOCK3.color;
        SETTINGS.canvasContext.fillRect(BLOCK3.x, BLOCK3.y, BLOCK3.size, BLOCK3.size);

        SETTINGS.canvasContext.fillStyle = LAKE.color;
        SETTINGS.canvasContext.fillRect(LAKE.x, LAKE.y, LAKE.size, LAKE.size);

        SETTINGS.canvasContext.fillStyle = PLAYER1.color;
        SETTINGS.canvasContext.fillRect(PLAYER1.x, PLAYER1.y, PLAYER1.size, PLAYER1.size);

        SETTINGS.canvasContext.fillStyle = GUNPLAYER1.color;
        SETTINGS.canvasContext.fillRect(GUNPLAYER1.x, GUNPLAYER1.y, GUNPLAYER1.width, GUNPLAYER1.height);

        SETTINGS.canvasContext.fillStyle = PLAYER2.color;
        SETTINGS.canvasContext.fillRect(PLAYER2.x, PLAYER2.y, PLAYER2.size, PLAYER2.size);

        SETTINGS.canvasContext.fillStyle = GUNPLAYER2.color;
        SETTINGS.canvasContext.fillRect(GUNPLAYER2.x, GUNPLAYER2.y, GUNPLAYER2.width, GUNPLAYER2.height);

        if (bullets.length > 0)
        {
            for (let i=0; i < bullets.length; i++)
            {   
                SETTINGS.canvasContext.beginPath();
                SETTINGS.canvasContext.fillStyle = bullets[i].color;
                SETTINGS.canvasContext.arc(bullets[i].x, bullets[i].y, bullets[i].size, 0, 2* Math.PI);
                SETTINGS.canvasContext.closePath();
                SETTINGS.canvasContext.fill();
                
            }
        }
    },

    play: function()
    {
        GAME.isWinner();
        GAME.update();
        GAME.draw();
    },


    update: function()
    {
        if (bullets.length>0)
        {
            let stayedBullets = [];
            for (let i=0; i < bullets.length; i++)    
            {
                bullets[i].x += bullets[i].xDirection;
                bullets[i].y += bullets[i].yDirection;
                if (GAME.isHit(PLAYER1, bullets[i]) || GAME.isHit(PLAYER2, bullets[i]) || GAME.isRock(BLOCK1, bullets[i]) || GAME.isRock(BLOCK2, bullets[i]) || GAME.isRock(BLOCK3, bullets[i]))
                {
                    continue;
                }
                if (bullets[i].x > 0 && bullets[i].y > 0 && bullets[i].x < SETTINGS.width && bullets[i].y < SETTINGS.height )
                {
                    stayedBullets.push(bullets[i]);
                }
            }
            bullets = stayedBullets;
        }

    },

    eventListners: function()
    {
        document.body.addEventListener('keydown', GAME.keyHandler);
    },

    keyHandler: function (event)
    {
        event = event.keyCode;
        
        if (event == 87) //w 
        {
            PLAYER1.direction = 87;
            PLAYER1.y -= PLAYER1.yDirection;

            if (GUNPLAYER1.width > GUNPLAYER1.height)
            {
                let container = 0;
                container = GUNPLAYER1.width;
                GUNPLAYER1.width = GUNPLAYER1.height;
                GUNPLAYER1.height = container;
            }
            GAME.onField(PLAYER1);
            GAME.onField(PLAYER2);
            GAME.pathBlocked();
            GUNPLAYER1.x = PLAYER1.x + 10;
            GUNPLAYER1.y = PLAYER1.y - GUNPLAYER1.height;
        }

        if (event == 83) //s 
        {
            PLAYER1.direction = 83;
            PLAYER1.y += PLAYER1.yDirection;

            if (GUNPLAYER1.width > GUNPLAYER1.height)
            {
                let container = 0;
                container = GUNPLAYER1.width;
                GUNPLAYER1.width = GUNPLAYER1.height;
                GUNPLAYER1.height = container;
            }
            GAME.onField(PLAYER1);
            GAME.onField(PLAYER2);
            GAME.pathBlocked();
            GUNPLAYER1.x = PLAYER1.x + 10;
            GUNPLAYER1.y = PLAYER1.y + PLAYER1.size;
        }

        if (event == 68) //d 
        {
            PLAYER1.direction = 68;
            PLAYER1.x += PLAYER1.xDirection;

            if (GUNPLAYER1.width < GUNPLAYER1.height)
            {
                let container = 0;
                container = GUNPLAYER1.width;
                GUNPLAYER1.width = GUNPLAYER1.height;
                GUNPLAYER1.height = container;
            }

            GAME.onField(PLAYER1);
            GAME.onField(PLAYER2);
            GAME.pathBlocked();
            GUNPLAYER1.x = PLAYER1.x + PLAYER1.size;
            GUNPLAYER1.y = PLAYER1.y + 10;
        }

        if (event == 65) //a 
        {
            PLAYER1.direction = 65;
            PLAYER1.x -= PLAYER1.xDirection;

            if (GUNPLAYER1.width < GUNPLAYER1.height)
            {
                let container = 0;
                container = GUNPLAYER1.width;
                GUNPLAYER1.width = GUNPLAYER1.height;
                GUNPLAYER1.height = container;
            }

            GAME.onField(PLAYER1);
            GAME.onField(PLAYER2);
            GAME.pathBlocked();
            GUNPLAYER1.x = PLAYER1.x - GUNPLAYER1.width;
            GUNPLAYER1.y = PLAYER1.y + 10;
        }

        if (event == 81) //q 
        {
            switch (PLAYER1.direction)
            {
                case 87: //w
                {
                    let bull = {
                        x: null,
                        y: null,
                        xDirection: 4,
                        yDirection: 4,
                        size: 5,
                        color: 'purple',    
                    };
                    bull.x = PLAYER1.x + PLAYER1.size/2;
                    bull.y = PLAYER1.y - PLAYER1.size/3;
                    bull.xDirection = 0;
                    bull.yDirection = -bull.yDirection;
                    bullets.push(bull);
                    break;
                }

                case 83: //s
                {
                    let bull = {
                        x: null,
                        y: null,
                        xDirection: 4,
                        yDirection: 4,
                        size: 5,
                        color: 'purple',    
                    };
                    bull.x = PLAYER1.x + PLAYER1.size/2;
                    bull.y = PLAYER1.y + PLAYER1.size*1.2;
                    bull.xDirection = 0;
                    bullets.push(bull);
                    break;
                }

                case 68: //d
                {
                    let bull = {
                        x: null,
                        y: null,
                        xDirection: 4,
                        yDirection: 4,
                        size: 5,
                        color: 'purple',    
                    };
                    bull.x = PLAYER1.x + PLAYER1.size*1.2;
                    bull.y = PLAYER1.y + PLAYER1.size/2;
                    bull.yDirection = 0;
                    bullets.push(bull);
                    break;
                }

                case 65: //a
                {
                    let bull = {
                        x: null,
                        y: null,
                        xDirection: 4,
                        yDirection: 4,
                        size: 5,
                        color: 'purple',    
                    };
                    bull.x = PLAYER1.x - PLAYER1.size/3;
                    bull.y = PLAYER1.y + PLAYER1.size/2;
                    bull.yDirection = 0;
                    bull.xDirection = -bull.xDirection;
                    bullets.push(bull);
                    break;
                }                          
            }


        }

        if (event == 40) //arrowdown 
        {
            PLAYER2.direction = 40;
            PLAYER2.y += PLAYER2.yDirection;

            if (GUNPLAYER2.width > GUNPLAYER2.height)
            {
                let container = 0;
                container = GUNPLAYER2.width;
                GUNPLAYER2.width = GUNPLAYER2.height;
                GUNPLAYER2.height = container;
            }

            GAME.onField(PLAYER1);
            GAME.onField(PLAYER2);
            GAME.pathBlocked();
            GUNPLAYER2.x = PLAYER2.x + 10;
            GUNPLAYER2.y = PLAYER2.y + PLAYER2.size;
        }

        if (event == 38) //arrowup 
        {
            PLAYER2.direction = 38;
            PLAYER2.y -= PLAYER2.yDirection;

            if (GUNPLAYER2.width > GUNPLAYER2.height)
            {
                let container = 0;
                container = GUNPLAYER2.width;
                GUNPLAYER2.width = GUNPLAYER2.height;
                GUNPLAYER2.height = container;
            }

            GAME.onField(PLAYER1);
            GAME.onField(PLAYER2);
            GAME.pathBlocked();
            GUNPLAYER2.x = PLAYER2.x + 10;
            GUNPLAYER2.y = PLAYER2.y - GUNPLAYER2.height;
        }

        if (event == 39) //arrowright 
        {
            PLAYER2.direction = 39;
            PLAYER2.x += PLAYER2.xDirection;

            if (GUNPLAYER2.width < GUNPLAYER2.height)
            {
                let container = 0;
                container = GUNPLAYER2.width;
                GUNPLAYER2.width = GUNPLAYER2.height;
                GUNPLAYER2.height = container;
            }

            GAME.onField(PLAYER1);
            GAME.onField(PLAYER2);
            GAME.pathBlocked();
            GUNPLAYER2.x = PLAYER2.x + PLAYER2.size;
            GUNPLAYER2.y = PLAYER2.y + 10;
        }

        if (event == 37) //arrowleft
        {
            PLAYER2.direction = 37;
            PLAYER2.x -= PLAYER2.xDirection;

            if (GUNPLAYER2.width < GUNPLAYER2.height)
            {
                let container = 0;
                container = GUNPLAYER2.width;
                GUNPLAYER2.width = GUNPLAYER2.height;
                GUNPLAYER2.height = container;
            }

            GAME.onField(PLAYER1);
            GAME.onField(PLAYER2);
            GAME.pathBlocked();
            GUNPLAYER2.x = PLAYER2.x - GUNPLAYER2.width;
            GUNPLAYER2.y = PLAYER2.y + 10;
        }

        if (event == 17) //right ctrl 
        {
            switch (PLAYER2.direction)
            {
                case 38: //arrowup
                {
                    let bull = {
                        x: null,
                        y: null,
                        xDirection: 4,
                        yDirection: 4,
                        size: 5,
                        color: 'purple',    
                    };
                    bull.x = PLAYER2.x + PLAYER2.size/2;
                    bull.y = PLAYER2.y - PLAYER2.size/3;
                    bull.xDirection = 0;
                    bull.yDirection = -bull.yDirection;
                    bullets.push(bull);
                    break;
                }

                case 40: //arrowdown
                {
                    let bull = {
                        x: null,
                        y: null,
                        xDirection: 4,
                        yDirection: 4,
                        size: 5,
                        color: 'purple',    
                    };
                    bull.x = PLAYER2.x + PLAYER2.size/2;
                    bull.y = PLAYER2.y + PLAYER2.size*1.2;
                    bull.xDirection = 0;
                    bullets.push(bull);
                    break;
                }

              case 39: //arrowright
                {
                    let bull = {
                        x: null,
                        y: null,
                        xDirection: 4,
                        yDirection: 4,
                        size: 5,
                        color: 'purple',    
                    };
                    bull.x = PLAYER2.x + PLAYER2.size*1.2;
                    bull.y = PLAYER2.y + PLAYER2.size/2;
                    bull.yDirection = 0;
                    bullets.push(bull);
                    break;
                }

                case 37: //arrowleft
                {
                    let bull = {
                        x: null,
                        y: null,
                        xDirection: 4,
                        yDirection: 4,
                        size: 5,
                        color: 'purple',    
                    };
                    bull.x = PLAYER2.x - PLAYER2.size/3;
                    bull.y = PLAYER2.y + PLAYER2.size/2;
                    bull.yDirection = 0;
                    bull.xDirection = -bull.xDirection;
                    bullets.push(bull);
                    break;
                }                          
            }
        }
    },

    isHit: function(p, bull)
    {
        const playerCor1 = [p.x,p.y];
        const playerCor2 = [p.x+p.size,p.y];
        const playerCor3 = [p.x+p.size, p.y+p.size];
        const playerCor4 = [p.x, p.y+p.size];

        if ( 
            (bull.x > playerCor1[0] && bull.x < playerCor2[0] && bull.y > playerCor1[1]) &&
            (bull.y > playerCor2[1] && bull.y < playerCor3[1] && bull.x < playerCor2[0]) &&
            (bull.x < playerCor3[0] && bull.x > playerCor4[0] && bull.y < playerCor3[1]) &&
            (bull.y < playerCor4[1] && bull.y > playerCor1[1] && bull.x > playerCor4[0])  
            )
        {

            p.health --;
            if (p == PLAYER1)
            {
                if (p.health == 2)
                {
                    GAME.heart1Player1.style.visibility = "hidden";
                    
                }

                if (p.health == 1)
                {
                    GAME.heart2Player1.style.visibility = "hidden";
                }

                if (p.health == 0)
                {
                    GAME.heart3Player1.style.visibility = "hidden";
                }
            } else
            {
                if (p.health == 2)
                {
                    GAME.heart1Player2.style.visibility = "hidden";
                }

                if (p.health == 1)
                {
                    GAME.heart2Player2.style.visibility = "hidden";
                }

                if (p.health == 0)
                {
                    GAME.heart3Player2.style.visibility = "hidden";
                }
            }
            return true;
        }
        return false;
    },

    isRock: function(block, bull)
    {
        const blockCor1 = [block.x, block.y];
        const blockCor2 = [block.x+block.size,block.y];
        const blockCor3 = [block.x+block.size, block.y+block.size];
        const blockCor4 = [block.x, block.y+block.size];

        if ( 
            (bull.x > blockCor1[0] && bull.x < blockCor2[0] && bull.y > blockCor1[1]) &&
            (bull.y > blockCor2[1] && bull.y < blockCor3[1] && bull.x < blockCor2[0]) &&
            (bull.x < blockCor3[0] && bull.x > blockCor4[0] && bull.y < blockCor3[1]) &&
            (bull.y < blockCor4[1] && bull.y > blockCor1[1] && bull.x > blockCor4[0])  
            )
        {
            return true;
        }
        return false;
    },

    onField: function(p)
    {
        if (p.x<0)
        {
            p.x+=p.xDirection;
        }

        if (p.x+p.size> SETTINGS.width)
        {
            p.x-=p.xDirection;
        }
        
        if (p.y<0)
        {
            p.y+=p.yDirection;
        }

        if (p.y+p.size> SETTINGS.width)
        {
            p.y-=p.yDirection;
        }
    },

    pathBlocked: function()
    {
        GAME.blockedRock(PLAYER1,BLOCK1);
        GAME.blockedRock(PLAYER1,BLOCK2);
        GAME.blockedRock(PLAYER1,BLOCK3);
        GAME.blockedRock(PLAYER2,BLOCK1);
        GAME.blockedRock(PLAYER2,BLOCK2);
        GAME.blockedRock(PLAYER2,BLOCK3);
        GAME.blockedRock(PLAYER1,LAKE);
        GAME.blockedRock(PLAYER2,LAKE);

    },

    blockedRock: function(p,block)
    {
        const blockCor1 = [block.x, block.y];
        const blockCor2 = [block.x+block.size,block.y];
        const blockCor3 = [block.x+block.size, block.y+block.size];
        const blockCor4 = [block.x, block.y+block.size];

        const playerCor1 = [p.x,p.y];
        const playerCor2 = [p.x+p.size,p.y];
        const playerCor3 = [p.x+p.size, p.y+p.size];
        const playerCor4 = [p.x, p.y+p.size];

        if (
            ((playerCor3[0]>blockCor1[0] && playerCor3[0]<blockCor2[0])||
            (playerCor4[0]>blockCor2[0] && playerCor4[0]<blockCor2[0])) &&
            (playerCor3[1]>blockCor1[1] && playerCor3[1]<blockCor4[1])
        )
        {
            p.y -=p.yDirection;
        }

        if (
            ((playerCor1[1]>blockCor2[1] && playerCor1[1]<blockCor3[1])||
            (playerCor4[1]>blockCor2[1] && playerCor4[1]<blockCor3[1])) &&
            (playerCor1[0]>blockCor1[0] && playerCor1[0]<blockCor2[0])
        )
        {
            p.x +=p.xDirection;
        }

        if (
            ((playerCor1[0]>blockCor4[0] && playerCor1[0]<blockCor3[0])||
            (playerCor2[0]>blockCor4[0] && playerCor2[0]<blockCor3[0])) &&
            (playerCor1[1]>blockCor1[1] && playerCor1[1]<blockCor3[1])
        )
        {
            p.y +=p.yDirection;
        }

        if (
            ((playerCor2[1]>blockCor1[1] && playerCor2[1]<blockCor4[1])||
            (playerCor3[1]>blockCor1[1] && playerCor3[1]<blockCor4[1])) &&
            (playerCor2[0]>blockCor1[0] && playerCor2[0]<blockCor2[0])
        )
        {
            p.x -=p.xDirection;
        }
    },
    
    isWinner: function()
    {
        if (PLAYER1.health == 0)
        {
            alert('Выиграл player2');
            window.location.reload(); 
            clearInterval(GAME.interval);
        } else if (PLAYER2.health == 0)
        {
            alert('Выиграл player1');
            window.location.reload(); 
            clearInterval(GAME.interval);
        }
    }

};

function init()
{
    GAME.gameInit();
}

init();