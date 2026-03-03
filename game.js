// ============================================================
//  💗  GINO & JOCELYN — Mini RPG  (Phaser 3 via CDN)
// ============================================================

// ── Spritesheets: 1080×1080, 3×3 grid = 360×360 per frame ──
// Row 0: DOWN (front), Row 1: RIGHT (side), Row 2: UP (back)
// LEFT = flipX of RIGHT row
const FRAME_W = 360;
const FRAME_H = 360;
const SPRITE_SCALE = 0.16;  // 360 * 0.16 ≈ 58px on screen
const PLAYER_SPEED = 150;
const INTERACT_RADIUS = 60;
const MAP_W = 2000;
const MAP_H = 1666;
const CAM_W = 800;
const CAM_H = 600;
const PLAYER_START_X = 1000;
const PLAYER_START_Y = 1450;
const NPC_X = 1000;
const NPC_Y = 350;
const NPC_WANDER_RADIUS = 24;
const NPC_WANDER_SPEED = 20;
const NPC_WANDER_PAUSE = 2500;
const CHEST_1 = { x:350, y:500 };
const CHEST_2 = { x:1650, y:500 };
const CHEST_3 = { x:170, y:1100 };

const COLLISION_RECTS = [
  {x:0,y:280,w:80,h:80},{x:0,y:1000,w:80,h:120},{x:0,y:1200,w:80,h:80},
  {x:0,y:520,w:200,h:480},{x:0,y:1120,w:200,h:80},{x:0,y:480,w:240,h:40},
  {x:0,y:360,w:320,h:120},{x:0,y:1320,w:720,h:160},{x:0,y:1280,w:920,h:40},
  {x:0,y:1480,w:920,h:160},{x:0,y:0,w:2000,h:280},{x:0,y:1640,w:2000,h:40},
  {x:120,y:1200,w:80,h:40},{x:120,y:280,w:200,h:40},{x:120,y:1240,w:800,h:40},
  {x:240,y:320,w:80,h:40},{x:280,y:480,w:40,h:40},{x:480,y:1000,w:120,h:80},
  {x:480,y:320,w:200,h:40},{x:480,y:360,w:440,h:40},{x:480,y:480,w:440,h:280},
  {x:480,y:880,w:440,h:120},{x:480,y:1080,w:440,h:80},{x:680,y:280,w:240,h:40},
  {x:760,y:1360,w:160,h:120},{x:840,y:1320,w:80,h:40},{x:1080,y:280,w:200,h:40},
  {x:1080,y:360,w:440,h:40},{x:1080,y:480,w:440,h:280},{x:1080,y:880,w:440,h:120},
  {x:1080,y:1080,w:440,h:80},{x:1080,y:1240,w:440,h:40},{x:1080,y:1280,w:760,h:120},
  {x:1080,y:1400,w:920,h:240},{x:1320,y:320,w:200,h:40},{x:1400,y:1000,w:120,h:80},
  {x:1680,y:480,w:40,h:40},{x:1680,y:320,w:120,h:40},{x:1680,y:920,w:120,h:40},
  {x:1680,y:280,w:320,h:40},{x:1680,y:360,w:320,h:120},{x:1680,y:880,w:320,h:40},
  {x:1680,y:960,w:320,h:240},{x:1760,y:480,w:240,h:40},{x:1800,y:520,w:200,h:360},
  {x:1800,y:1200,w:200,h:80},{x:1880,y:1280,w:120,h:80},{x:1920,y:320,w:80,h:40},
  {x:1920,y:920,w:80,h:40},{x:1920,y:1360,w:80,h:40},
];

const DLG = {
  intro:    {t:'welcome!', b:'hi gino, my love <3\n\ni made you a little game (with a lot of effort).\nobjective: explore the map and collect 3 hearts\nhidden in treasure chests.\n\ncome back to me when you\'ve collected all 3.\n\ngood luck!!!'},
  notYet:   {t:'hey, amor!', b:'you found me! but you need to collect 3 hearts,\nstored in treasure chests across the map,\nin order to win the game.\n\ncome back to me when you\'ve collected all 3.'},
  c1:       {t:'heart 1/3 💗', b:'first heart collected.\n\ngino, thank you for being kind to me\neven when i was still healing.\n\nyou showed up gently.\nand that mattered more than you know.'},
  c2:       {t:'heart 2/3 💗', b:'second heart collected.\n\nthank you for introducing me to a new world,\ninviting me out,\nand making me feel welcomed.\n\nyou made space for me\nbefore i even knew how to ask for it.'},
  c3:       {t:'heart 3/3 💗', b:'third heart collected.\n\nyou\'ve been consistent.\nrespectful.\nreal.\n\ntwo years later,\nand i still feel lucky\nthat i get to love you.'},
  empty:    {t:'empty!', b:'you already opened this chest 🙈\n\nbut i\'ll still count it as cute that you checked.'},
  allDone:  {t:'all hearts collected 💌', b:'okay gino…\n\nyou have all 3 hearts now.\n\ncome find me.'},
  success:  {t:'success!!', b:'mission accomplished! 🎮\n\nyou braved the challenges,\ncollected 3 hearts,\nand reached the end.\n\nhappy 2 year anniversary, gino.\nthank you for loving me\nwith effort and intention.\n\nas the ultimate reward,\nhere\'s the final question for you…'},
  question: {t:'final question…', b:'will you keep choosing me? 💗'},
  yes:      {t:'🥹💞', b:'okay… i\'m gonna cry.\n\ni love you, gino.\nthank you for being my safe place.\n\nyear 3 loading…'},
  no:       {t:'be serious 😭', b:'wrong answer, my love.\n\ntry again.'}
};

// ── Modal ───────────────────────────────────────────────────
const $ov=document.getElementById('modal-overlay');
const $ti=document.getElementById('modal-title');
const $bo=document.getElementById('modal-body');
const $bt=document.getElementById('modal-buttons');
let modalOpen=false;
function modal(t,b,btns){$ti.textContent=t;$bo.textContent=b;$bt.innerHTML='';btns.forEach(b=>{const el=document.createElement('button');el.textContent=b.text;el.className=b.cls||'btn-primary';el.onclick=()=>{closeModal();if(b.fn)b.fn();};$bt.appendChild(el);});$ov.classList.remove('hidden');modalOpen=true;}
function closeModal(){$ov.classList.add('hidden');modalOpen=false;}
function okModal(t,b,fn){modal(t,b,[{text:'OK',cls:'btn-primary',fn}]);}

// ── Phaser ──────────────────────────────────────────────────
const game=new Phaser.Game({
  type:Phaser.AUTO,width:CAM_W,height:CAM_H,
  parent:'game-container',pixelArt:true,
  physics:{default:'arcade',arcade:{debug:false}},
  scene:{preload,create,update},
  scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH}
});

let player,jocelyn,cursors,wasd,keyE,keySpace;
let chests=[],hearts=0,dir='down',sc;
const $pr=document.getElementById('interact-prompt');

function preload(){
  this.load.image('map','assets/tiles/map.png');
  this.load.spritesheet('gino','assets/sprites/gino_sheet.png',
    {frameWidth:FRAME_W,frameHeight:FRAME_H});
  this.load.spritesheet('jocelyn','assets/sprites/jocelyn_sheet.png',
    {frameWidth:FRAME_W,frameHeight:FRAME_H});
  this.load.image('chest_closed','assets/sprites/chest_closed.png');
  this.load.image('chest_open','assets/sprites/chest_open.png');
  this.load.image('heart','assets/sprites/heart.png');
}

function create(){
  sc=this;
  this.add.image(0,0,'map').setOrigin(0,0).setDisplaySize(MAP_W,MAP_H);
  this.physics.world.setBounds(0,0,MAP_W,MAP_H);
  this.cameras.main.setBounds(0,0,MAP_W,MAP_H);

  const walls=this.physics.add.staticGroup();
  COLLISION_RECTS.forEach(r=>{
    const w=this.add.rectangle(r.x+r.w/2,r.y+r.h/2,r.w,r.h,0xff0000,0);
    this.physics.add.existing(w,true);walls.add(w);
  });

  [{...CHEST_1,d:DLG.c1},{...CHEST_2,d:DLG.c2},{...CHEST_3,d:DLG.c3}].forEach(cfg=>{
    const c=this.add.image(cfg.x,cfg.y,'chest_closed').setDepth(1);
    c.opened=false;c.dlg=cfg.d;chests.push(c);
  });

  mkAnims(this,'gino');
  mkAnims(this,'jocelyn');

  // Player (Gino) — scaled down hitbox for feet area
  player=this.physics.add.sprite(PLAYER_START_X,PLAYER_START_Y,'gino',0);
  player.setScale(SPRITE_SCALE).setCollideWorldBounds(true).setDepth(5);
  player.body.setSize(FRAME_W*0.4,FRAME_H*0.2);
  player.body.setOffset(FRAME_W*0.3,FRAME_H*0.75);
  this.physics.add.collider(player,walls);
  this.cameras.main.startFollow(player,true,0.09,0.09);

  // Jocelyn NPC
  jocelyn=this.physics.add.sprite(NPC_X,NPC_Y,'jocelyn',0);
  jocelyn.setScale(SPRITE_SCALE).setDepth(5).setImmovable(true);
  jocelyn.body.setSize(FRAME_W*0.4,FRAME_H*0.2);
  jocelyn.body.setOffset(FRAME_W*0.3,FRAME_H*0.75);
  this.physics.add.collider(player,jocelyn);
  wander(this);

  // Rain
  const gfx=this.make.graphics({add:false});
  gfx.fillStyle(0x8899bb,0.35);gfx.fillRect(0,0,1,4);
  gfx.generateTexture('drop',1,4);gfx.destroy();
  this.add.particles(0,0,'drop',{
    x:{min:-100,max:MAP_W+100},y:-20,lifespan:1200,
    speedY:{min:250,max:400},speedX:{min:-15,max:-5},
    scale:{min:1,max:2.5},alpha:{start:0.3,end:0.05},
    quantity:3,frequency:20,blendMode:'ADD'
  }).setDepth(100);

  cursors=this.input.keyboard.createCursorKeys();
  wasd=this.input.keyboard.addKeys('W,A,S,D');
  keyE=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
  keySpace=this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

  okModal(DLG.intro.t,DLG.intro.b);
}

// ── Animations (3×3: row0=down, row1=right, row2=up) ───────
function mkAnims(s,k){
  s.anims.create({key:`${k}_walk_down`,frames:[{key:k,frame:1},{key:k,frame:0},{key:k,frame:2},{key:k,frame:0}],frameRate:7,repeat:-1});
  s.anims.create({key:`${k}_idle_down`,frames:[{key:k,frame:0}],frameRate:1,repeat:0});
  s.anims.create({key:`${k}_walk_right`,frames:[{key:k,frame:4},{key:k,frame:3},{key:k,frame:5},{key:k,frame:3}],frameRate:7,repeat:-1});
  s.anims.create({key:`${k}_idle_right`,frames:[{key:k,frame:3}],frameRate:1,repeat:0});
  s.anims.create({key:`${k}_walk_left`,frames:[{key:k,frame:4},{key:k,frame:3},{key:k,frame:5},{key:k,frame:3}],frameRate:7,repeat:-1});
  s.anims.create({key:`${k}_idle_left`,frames:[{key:k,frame:3}],frameRate:1,repeat:0});
  s.anims.create({key:`${k}_walk_up`,frames:[{key:k,frame:7},{key:k,frame:6},{key:k,frame:8},{key:k,frame:6}],frameRate:7,repeat:-1});
  s.anims.create({key:`${k}_idle_up`,frames:[{key:k,frame:6}],frameRate:1,repeat:0});
}

// ── Wander ──────────────────────────────────────────────────
function wander(s){
  function step(){
    if(!jocelyn?.body)return;
    const a=Math.random()*Math.PI*2,r=Math.random()*NPC_WANDER_RADIUS;
    const tx=NPC_X+Math.cos(a)*r,ty=NPC_Y+Math.sin(a)*r;
    const dx=tx-jocelyn.x,dy=ty-jocelyn.y,len=Math.hypot(dx,dy);
    const d=Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up');
    jocelyn.flipX=(d==='left');
    jocelyn.anims.play(`jocelyn_walk_${d}`,true);
    s.tweens.add({targets:jocelyn,x:tx,y:ty,duration:Math.max(400,(len/NPC_WANDER_SPEED)*1000),ease:'Linear',
      onComplete:()=>{jocelyn.anims.play(`jocelyn_idle_${d}`,true);jocelyn.flipX=(d==='left');
        s.time.delayedCall(NPC_WANDER_PAUSE+Math.random()*1500,step);}});
  }
  s.time.delayedCall(800,step);
}

// ── Update ──────────────────────────────────────────────────
function update(){
  if(!player?.body)return;
  if(modalOpen){player.setVelocity(0,0);player.anims.play(`gino_idle_${dir}`,true);player.flipX=(dir==='left');return;}
  let vx=0,vy=0,moving=false;
  const L=cursors.left.isDown||wasd.A.isDown,R=cursors.right.isDown||wasd.D.isDown;
  const U=cursors.up.isDown||wasd.W.isDown,D=cursors.down.isDown||wasd.S.isDown;
  if(L&&!R){vx=-PLAYER_SPEED;dir='left';moving=true;}
  if(R&&!L){vx=PLAYER_SPEED;dir='right';moving=true;}
  if(U&&!D){vy=-PLAYER_SPEED;dir='up';moving=true;}
  if(D&&!U){vy=PLAYER_SPEED;dir='down';moving=true;}
  if(vx&&vy){vx*=0.7071;vy*=0.7071;}
  player.setVelocity(vx,vy);
  player.anims.play(moving?`gino_walk_${dir}`:`gino_idle_${dir}`,true);
  player.flipX=(dir==='left');
  const nc=chests.find(c=>Math.hypot(player.x-c.x,player.y-c.y)<INTERACT_RADIUS);
  const nj=Math.hypot(player.x-jocelyn.x,player.y-jocelyn.y)<INTERACT_RADIUS;
  if(nc||nj)$pr.classList.remove('hidden');else $pr.classList.add('hidden');
  if(Phaser.Input.Keyboard.JustDown(keyE)||Phaser.Input.Keyboard.JustDown(keySpace)){
    if(nc)openChest(nc);else if(nj)talkJocelyn();}
  player.setDepth(player.y);jocelyn.setDepth(jocelyn.y);chests.forEach(c=>c.setDepth(c.y));
}

function openChest(c){
  if(c.opened){okModal(DLG.empty.t,DLG.empty.b);return;}
  c.opened=true;c.setTexture('chest_open');hearts++;
  document.getElementById('hud-hearts').textContent=`💗 ${hearts} / 3`;
  if(sc){const h=sc.add.image(c.x,c.y-30,'heart').setScale(0.8).setDepth(200);
    sc.tweens.add({targets:h,y:c.y-65,alpha:0,duration:800,ease:'Power2',onComplete:()=>h.destroy()});}
  okModal(c.dlg.t,c.dlg.b,()=>{if(hearts>=3)okModal(DLG.allDone.t,DLG.allDone.b);});
}

function talkJocelyn(){
  if(hearts<3){okModal(DLG.notYet.t,DLG.notYet.b);return;}
  okModal(DLG.success.t,DLG.success.b,()=>{
    modal(DLG.question.t,DLG.question.b,[
      {text:'Yes 💗',cls:'btn-yes',fn:()=>okModal(DLG.yes.t,DLG.yes.b)},
      {text:'No',cls:'btn-no',fn:()=>okModal(DLG.no.t,DLG.no.b)}
    ]);
  });
}
