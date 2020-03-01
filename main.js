// ============================================================
// SRAM remake
// By Pierre Matterne
// ============================================================

Vue.component('scene', {
	props: ['display'],
	template: '<div class="scene"><img v-bind:src="display"></div>',
	data: function() {
		return {}
	},
	methods: {

	}
});

// ============================================================

Vue.component('descripscene', {
	props: ['texte'],
	template: '<div class="description">{{texte}}</div>',
});

// ============================================================

Vue.component('compas', {
	props: ['directions'],
	template: '<div class="compas">\
  <div class="reflet"></div>\
  <div class="nord"  v-bind:class="{active:directions[0]}">N</div>\
  <div class="est"   v-bind:class="{active:directions[1]}">E</div>\
  <div class="sud"   v-bind:class="{active:directions[2]}">S</div>\
  <div class="ouest" v-bind:class="{active:directions[3]}">O</div>\
  </div>',
  data: function() {
    return {
    }
  },
  methods: {
    incrementSimpleBuilding: function() {
     this.$emit('incbuild');
   }
 }
});

// ============================================================

Vue.component('reaction', {
	props: ['display'],
	template: '<div class="reaction">{{display}}</div>',
});

// ============================================================

Vue.component('inventaire', {
	props: ['contenu'],
	template: '<div class="inventaire"><div v-for="item in contenu" v-if="item.found && item.showable === true"><img v-bind:src="item.image"></div></div>',
});

// ============================================================

var game = new Vue({
	el: '#game',

  // ============================================================
  // DATAs
  // ============================================================
  
  data: {

  	currentLocation: 'chambreroi',
  	displayInfo: '',
  	title: 'Sunev (v0.4)',

  	inventaire: {
      // markers for progression or dialogues
      mission:        {found:false, showable:false},
      animalLibre:    {found:false, showable:false},  
      champsLaboures: {found:false, showable:false},
      versdonnes:     {found:false, showable:false},
      // inventory of objects
      vers:           {found:false, showable:true, image:'./inventory/vers.png'},       
      oeufs:          {found:false, showable:true, image:'./inventory/oeuf.png'},
      cristal:        {found:false, showable:true, image:'./inventory/cristal.png'},
      champignons:    {found:false, showable:true, image:'./inventory/champignons.png'},
      ossements:      {found:false, showable:true, image:'./inventory/ossement.png'},
      coquillage:     {found:false, showable:true, image:'./inventory/coquillage.png'},
      potion:         {found:false, showable:true, image:'./inventory/potion.png'},
      pelle:          {found:false, showable:true, image:'./inventory/pelle.png'},
      or:             {found:false, showable:true, image:'./inventory/or.png'},
      bougie:         {found:false, showable:true, image:'./inventory/bougie.png'},
    },

    locations: {



     chambreroi: {
      name: "La chambre du roi",
      image: "rooms/chambreroi.png",
      initialDescription: "La pièce est sombre. Un rai de lumière éclaire le lit dans lequel est couché un roi malade.",
      availDirections : [false, false, true, false],        
      nextRooms: {
       'sud' : 'entreechateau'
     },
     actions: [
     {
       verbes: ['regarder'],
       objet:[''],
       reponse: "Le roi est fièvreux. L'air frais de l'extérieur lui permet de respirer. Son souffle est rauque. L'odeur qu'il dégage n'est pas rassurante. La reine se tient à ses côté et le veille." 
     },
     {
       verbes: [''],
       objet:['indice','aide'],
       condition: '!game.inventaire.potion.found',
       reponse: "Ne soyez pas timide !" 
     },
     {
       verbes: [],
       objet:['indice','aide'],
       condition: 'game.inventaire.potion.found',
       reponse: "Le roi a besoin de sa potion MAINTENANT !"          
     },
     {
       verbes: ['parler','discuter'],
       objet:['roi', 'monsieur', 'malade'],
       reponse: "Le roi ne se rend même pas compte de votre présence. Il est trop malade pour vous répondre." 
     },
     {
       verbes: ['parler', 'discuter'],
       objet:['reine', 'dame'],
       reponse: "Le roi a été empoisonné. Trouvez Cimeric la sorcière et demandez-lui de nous venir en aide. Faites vite !",
       inventaire: {mission: true}, 
     },
     {
       verbes: ['rassurer', 'consoler'],
       objet: ['reine', 'dame'],
       reponse: "Merci pour vos efforts.",
     },
     {
       verbes: ['soigner', 'guérir'],
       objet:['roi', 'monsieur', 'malade'],
       reponse: "Vous n'êtes pas medecin. Vos \"soins\" sont sans effets.", 
     },
     {
       verbes: ['donner'],
       objet:['potion'],
       reponse: "Le roi est sauvé !", 
       condition: 'game.inventaire.potion.found',
       deplacement: 'victoire'
     },
     {
       verbes: ['sortir'],
       objet:[''],
       reponse: "", 
       deplacement: 'entreechateau'
     },
     {
       verbes: ['où', 'trouver', 'connaissez'],
       objet: ['cimeric', 'sorcière'],
       reponse: "On dit qu'elle habite dans un bois à l'Ouest, mais je ne saurais vous en dire plus."
     },
     {
       verbes: ['demander', 'quel'],
       objet: ['chemin', 'route'],
       reponse: "La sorcière qu'il vous faut trouver habite dans un bois à l'Ouest, non loin du chateau."
     },
     {
       verbes:[''],
       objet: ['merci'],
       reponse:"La reine ne réagit pas. Le roi non plus."
     },
     {
      verbes: ['bavarder'],
      objet:[''],
      reponse: "La reine n'est pas intéressée et le roi n'est pas en état. Qu'aviez-vous en tête ?"
    },
    ]
  },



  entreechateau: {
    name: "L'entrée du chateau royal",
    image: "rooms/entreechateau.png",
    initialDescription: "L'entrée n'est pas majestueuse, mais deux gardes sont postés et chassent les intrus.",
    availDirections : [true, false, true, false],
    nextRooms: {
     'nord': 'chambreroi',
     'sud' : 'plainechateau'
   },
   actions: [
   {
     verbes: ['regarder'],
     objet:[''],
     reponse: "Les deux gardes, bien que sévère et bien bâtis, sont probablement de chics types." 
   },
   {
     verbes: [''],
     objet:['indice','aide'],
     reponse: "Entrez ou sortez mais fermez la porte derrière vous !" 
   },
   {
     verbes: ['parler'],
     objet:['garde'],
     condition: '!game.inventaire.mission.found',
     reponse: "Que venez-vous faire ici ?" 
   },
   {
     verbes: ['parler'],
     objet:['garde'],
     condition: 'game.inventaire.mission.found',
     reponse: "Hâtez-vous donc ! La reine vous a confié une mission, non ?"           
   },
   {
     verbes: ['taper', 'tuer', 'frapper'],
     objet:['garde'],
     reponse: "Vous voulez finir en prison ?"           
   },
   {
     verbes: ['où', 'trouver'],
     objet: ['cimeric', 'sorcière'],
     reponse: "La sorcière ? Elle vit seule dans les bois. Partez vers l'Ouest et vous ne tarderez pas à trouver sa chaumière."
   },
   {
     verbes: ['demander', 'quel'],
     objet: ['chemin', 'route'],
     reponse: "Pour aller où ? À l'Ouest il y a les bois. Au sud, les fermes puis les plages du royaume. À l'Est vous trouverez le vieux phare."
   },
   {
     verbes:[''],
     objet: ['merci'],
     reponse:"Les gardes ne répondent rien. Ils n'ont après tout fait que leur devoir."
   },
   {
    verbes: ['bavarder'],
    objet:[''],
    reponse: "Les gardes hésitent un peu mais vous parvenez à les mettre en confiance. Ils vous en racontent de belle sur leur chef."
  },


  ]
},



plainechateau: {
  name: "Les plaines du chateau",
  image: "rooms/plainechateau.png",
  initialDescription: "Le chateau, construit sur une ancienne cheminée volcanique, domine toute la région.",
  availDirections : [true, true, true, true],
  nextRooms: {
   'nord': 'entreechateau',
   'est': 'falaises',
   'sud' : 'fermes',
   'ouest': 'plaine'
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "La chateau est entouré de plaines. Pratique pour voir un envahisseur au loin." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Le monde est vaste, il ne tient qu'à vous de l'explorer !" 
 },
 {
   verbes: ['regarder', 'lire'],
   objet:['panneau','pancarte','signe'],
   reponse: "À l'Ouest la grand plaine, au Sud les fermes et à l'Est, la falaise." 
 },
 {
   verbes: ['creuser'],
   objet:[''],
   reponse: "Vous allez vous attirer des ennuis si vous faites des trous n'importe où." 
 },
 {
  verbes: ['bavarder'],
  objet:[''],
  reponse: "Patati et patata. Vous parlez souvent dans le vide ?"
},
]
},



fermes: {
  name: "Les fermes du chateau",
  image: "rooms/fermes.png",
  initialDescription: "Les champs et les fermes ne payent pas de mine, mais nourissent le royaume depuis des années.",
  availDirections : [true, true, true, true],
  nextRooms: {
   'nord': 'plainechateau',
   'est': 'plage',
   'sud' : 'riviere',
   'ouest': 'pecheur'
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Le fermier a l'air épuisé. Entre les labours, la traite des vaches et les fenaisons, il y en a du boulot !" 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Les fermiers sont des gens très occupés." 
 },
 {
   verbes: ['regarder'],
   objet:['outils', 'pelle'],
   reponse: "Voilà un bel outil !" 
 },
 {
   verbes: ['labourer'],
   objet:['champ', ''],
   reponse: "Le fermier appréciera",
   inventaire: {champsLaboures: true} 
 },
 {
   verbes: ['aider', 'travailler', 'faire'],
   objet:['fermier', 'labours', 'paysan'],
   reponse: "Le fermier appréciera votre aide. Peut-être aura-t-il le temps de vous parler maintenant.",
   inventaire: {champsLaboures: true} 
 },

 {
   verbes: ['parler'],
   objet:['fermier','paysan'],
   condition: '!game.inventaire.champsLaboures.found', 
   reponse: "Je n'ai pas le temps de t'aider, j'ai mes labours à faire." 
 },

 {
   verbes: ['parler'],
   objet:['fermier','paysan'],
   condition: 'game.inventaire.champsLaboures.found', 
   reponse: "Grâce à toi, j'ai du temps pour traire mes vaches. Voici des oeufs pour te remercier de ton aide.",
   inventaire: {oeufs: true},
 },
 {
   verbes: ['as-tu'],
   objet: ['pelle'],
   condition: '!game.inventaire.pelle.found',
   reponse: "Oui, j'ai une pelle."
 },
 {
   verbes: ['as-tu'],
   objet: ['pelle'],
   condition: 'game.inventaire.pelle.found',
   reponse: "Vous me l'avez déjà achetée."
 },
 {
   verbes: ['louer','emprunter','acheter','demander', 'prendre', 'échanger'],
   objet:['pelle'],
   condition: '!game.inventaire.or.found',
   reponse: "C'est un très bon outil. Je ne peux pas vous le prêter comme ça ! Que proposez-vous en échange ?"
 },
 {
   verbes: ['donner','échanger'],
   objet:['or', 'pelle'],
   condition: 'game.inventaire.or.found',
   reponse: "Une telle pépite, en échange, je vous offre ma pelle bien volontiers.",
   inventaire: {pelle: true, or:false},
 },
 {
   verbes: ['louer','emprunter','acheter','demander', 'prendre'],
   objet:['pelle'],
   condition: 'game.inventaire.or.found',
   reponse: "Bien sûr ! Puisque vous me l'échangez contre un peu d'or.",
   inventaire: {pelle: true, or:false},
 },
 {
   verbes: ['où', 'trouver', 'connaissez'],
   objet: ['cimeric', 'sorcière'],
   reponse: "Mieux vaut ne pas vous en approcher. Si vraiment vous voulez la voir, allez vers l'Ouest."
 },
 {
   verbes:[''],
   objet: ['merci'],
   reponse:"De quoi donc ?"
 },
 {
  verbes: ['bavarder'],
  objet:[''],
  reponse: "Vous en apprenez beaucoup sur les techniques de semis, le bois raméal fragmenté et la culture biologique."
},
]
},



riviere: {
  name: "La rivière",
  image: "rooms/riviere.png",
  initialDescription: "La rivière est trop large ici pour être traversée. Jadis, un pont l'enjambait, mais le royaume auquel il menait a disparu depuis longtemps.",
  availDirections : [true, true, false, true],
  nextRooms: {
   'nord': 'fermes',
   'est': 'plagecoquillages',
   'sud' : '',
   'ouest': 'sousbois'
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Le courant est très fort ici. Trop pour une traversée à pied." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "N'essayez pas !" 
 },
 {
   verbes: ['traverser'],
   objet:['rivière'],
   reponse: "À peine avez vous fait quelques pas dans l'eau que le courant vous emporte.",
   deplacement: 'mort' 
 },
 ]
},



entreegrotte: {
  name: "L'entrée d'une caverne",
  image: "rooms/entreegrotte.png",
  initialDescription: "La caverne semble calme vue de l'extérieur. Sur le roc, des traces de griffes.",
  availDirections : [false, false, true, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : 'montagne',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "La bête qui vit ou a vécu là est le genre qu'on aime pas rencontrer." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Entrez à vos risques et périls." 
 },
 {
  verbes: ['entre'],
  objet:[''],
  deplacement: 'grotte',
  reponse: "Vous entrez." 
},
]
},



grotte: {
  name: "La grotte de l'ours",
  image: "rooms/grotte.png",
  initialDescription: "La caverne est lugubre. À chacun de vos pas, le sol a une étrange façon de craquer.",
  availDirections : [false, false, false, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : '',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Vous ne distinguez rien précisément. Vos yeux sont impuissant à s'adapter à l'obscurité du lieu." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Éclairez-vous ou utilisez vos mains." 
 },
 {
   verbes: ['tâter', 'tâtonner', 'palper'],
   objet:['sol','terre'],
   reponse: "Le sol est jonché d'ossements. Certains sont certainement humains." 
 },
 {
   verbes: ['prendre', 'ramasser'],
   objet:['os', 'ossements'],
   reponse: "Vous prenez un bel os, probablement d'un animal, mais vous n'en jureriez pas.",
   inventaire: {ossements: true}
 },
 {
   verbes: ['sortir', 'sors'],
   objet:[''],
   deplacement: 'entreegrotte',
   reponse: "Vous sortez." 
 },
 {
   verbes: ['utiliser', 'allumer'],
   objet: ['bougie'],
   reponse: "Vous y voyez un peu plus clair. Les craquements sous vos pas, ce sont les reliefs de repas de la bête : une montagne d'os."
 },
 ]
},



montagne: {
  name: "La montagne du Nord",
  image: "rooms/montagne.png",
  initialDescription: "Rien ne pousse sur ces terres. Rien n'y vit donc. Au mieux, on y passe.",
  availDirections : [true, true, false, false],
  nextRooms: {
   'nord': 'entreegrotte',
   'est': 'foretdense',
   'sud' : '',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Rien ne pousse sur le roc gelé." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "…" 
 },
 ]
},



foretdense: {
  name: "Une forêt dense",
  image: "rooms/foretdense.png",
  initialDescription: "Ce n'est pas la jungle, mais votre progression est très ralentie par les inombrables ronces.",
  availDirections : [true, false, true, true],
  nextRooms: {
    'nord': 'animal', 
    'est': '',
    'sud' : 'foret',
    'ouest': 'montagne'
  },
  actions: [
  {
   verbes: ['regarder'],
   objet:[''],
   reponse: "La forêt est si dense que vous ne voyez pas bien loin." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Ce n'est qu'un jeu, vous ne risquez pas de vous perdre." 
 },
 ]
},



animal: {
  name: "Le repère d'un animal",
  image: "rooms/animal.png",
  initialDescription: "Dans une fosse, un animal épuisé semble s'être pris la patte dans un piège.",
  availDirections : [false, false, true, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : 'foretdense',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Un animal semble être pris dans un piège" 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "" 
 },
 {
   verbes: ['regarder'],
   objet:['animal'],
   reponse: "Il a l'air farouche. Mais il est blessé : sa patte est prise dans un piège." 
 },
 {
  verbes: ['aider', 'libérer'],
  objet:['animal'],
  reponse: "Vous le libérez et il file sans demander son reste. La sorcière sera contente.", 
  inventaire: {animalLibre: true},
  deplacement: 'animalabsent'
},
{
 verbes: ['ouvrir', 'retirer', 'enlever'],
 objet:['piège'],
 reponse: "Vous le libérez et il file sans demander son reste. La sorcière sera contente.", 
 inventaire: {animalLibre: true},
 deplacement: 'animalabsent'
},
{
  verbes: ['bavarder'],
  objet:[''],
  reponse: "Il ne semble pas vouloir vous écouter, ou vous répondre."
},

]
},



animalabsent: {
  name: "Le repère d'un animal",
  image: "rooms/animalabsent.png",
  initialDescription: "La fosse est vide. L'animal que vous avez libéré a filé.",
  availDirections : [false, false, true, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : 'foretdense',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Un piège, à ours sans doute, se trouve là où quelques instants auparavent un animal agonisait." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "" 
 },
 {
   verbes: ['regarder'],
   objet:['piège'],
   reponse: "Il est couvert du sang de l'animal." 
 },


 ]
},



foret: {
  name: "Une bien jolie foret",
  image: "rooms/foret.png",
  initialDescription: "La végétation luxuriante invite au calme.",
  availDirections : [true, false, true, false],
  nextRooms: {
   'nord': 'foretdense',
   'est': '',
   'sud' : 'plaine',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Vous apercevez des champignons au pied d'un arbre. Vous pensez qu'il sont comestibles." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "" 
 },
 {
   verbes: ['ramasser', 'prendre', 'cueillir'],
   objet:['champignon'],
   reponse: "Vous cueillez ceux dont vous savez qu'ils ne vous empoisonneront pas.",
   inventaire: {champignons: true} 
 },
 ]
},



plaine: {
  name: "La grande plaine",
  image: "rooms/plaine.png",
  initialDescription: "Cette vaste étendue semble s'étirer à l'infini. Ça et là, un peu de végétation brise l'horizontalité du lieu.",
  availDirections : [true, true, true, true],
  nextRooms: {
   'nord': 'foret',
   'est': 'plainechateau',
   'sud' : 'pecheur',
   'ouest': 'hutte'
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Rien ne semble intéressant à la surface." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Il faudra vous creuser un peu ici." 
 },
 {
   verbes: ['creuser'],
   objet:[''],
   condition: '!game.inventaire.pelle.found', 
   reponse: "Le sol est trop dur pour l'attaquer à main nue."
 },
 {
   verbes: ['creuser'],
   objet:['', 'pelle'],
   condition: 'game.inventaire.pelle.found', 
   reponse: "Vous trouvez de gros vers des plaines",
   inventaire: {vers:true}
 },
 ]
},



hutte: {
  name: "Une hutte lugubre",
  image: "rooms/hutte.png",
  initialDescription: "Le coin est sinistre. Mais une certaine sérénité se dégage de cette bâtisse retirée.",
  availDirections : [false, true, false, false],
  nextRooms: {
   'nord': '',
   'est': 'plaine',
   'sud' : '',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "En observant mieux, vous voyez que les arbres alentours portent tous une amulette, un gri-gri ou d'autres choses de cet ordre." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Qui peut bien vivre là ? On va voir ?" 
 },
 {
   verbes: ['regarder', 'observer'],
   objet: ['gris-gris', 'fétiche', 'amulette', 'décoration'],
   reponse: "Vous ignorez leur usage, mais ils ne vous rassurent pas."
 },
 {
   verbes: ['prendre', 'saisir','ramasser', 'approcher'],
   objet: ['gris-gris', 'fétiche', 'amulette', 'décoration'],
   reponse: "…et recevoir une malédiction ? non merci !"
 },
 {
   verbes: ['frapper', 'toquer'],
   objet:['porte'],
   reponse: "Toc toc toc ? … Une petite voix vous invite à entrer." 
 },
 {
   verbes: ['entrer', 'ouvrir'],
   objet:['','porte','hutte', 'chaumière', 'bâtisse', 'maison', 'cabane'],
   reponse: "Vous prenez votre courage à deux mains et vous franchissez le seuil.",
   deplacement: "sorciere" 
 },
 ]
},



sorciere: {
  name: "L'antre de la sorcière",
  image: "rooms/sorciere.png",
  initialDescription: "Occupée avec son chaudron (peut-être une soupe ?), une dame d'un certain age.",
  availDirections : [false, false, true, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : 'hutte',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "La maison est remplie d'objet hétéroclites dont vous ignorez l'usage. Mieux vaut ne toucher à rien." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Ne soyez pas timide !" 
 },
 {
   verbes: ['parler'],
   objet:['sorcière'],
   reponse: "Je peux te faire une potion, mais tu dois d'abord aider un ami. Vas au nord et aide celui qui est blessé.",
   condition: '!game.inventaire.animalLibre.found', 
 },
 {
  verbes: ['parler', 'discuter'],
  objet:['sorcière', 'dame'],
  reponse: "Merci pour lui. Pour faire une potion pour guérir le roi, j'ai besoin de ces 6 ingrédients : des vers bien gros et bien juteux, la coquille d'un mollusque, un cristal de roche, des ossements bien propres, un oeuf pour le liant et des champignons, pour le goût.", 
  condition: 'game.inventaire.animalLibre.found',
},
{
 verbes: ['donner'],
 objet:['ingrédients'],
 condition: '!game.inventaire.oeufs.found || !game.inventaire.vers.found',
 reponse: "Il manque au moins un ingrédient.", 
},
{
 verbes: ['donner'],
 objet:['vers','cristal','oeufs','coquillage','ossements','champignons'],
 reponse: "Ne me les donnez pas un par un ! Rassemblez tous les ingrédients puis revenez me voir."
},
{
 verbes: ['donner'],
 objet:['ingrédients'],
 condition: 'game.inventaire.oeufs.found && game.inventaire.vers.found',
 reponse: "Voici ta potion ! Va vite la donner au roi.",         
 inventaire: {potion: true, oeufs:false, vers:false, cristal: false, champignons:false, ossements:false, coquillage:false}
},
{
 verbes:[''],
 objet: ['merci'],
 reponse:"Elle vous regarde d'un drôle d'air et ne répond rien…"
},
{
 verbes: ['prendre'],
 objet:['ail', 'objet', 'gris-gris','amulette','aïl','gourde'],
 reponse: "Ne touchez à rien, cela vaut mieux pour votre santé !" 
},
{
  verbes: ['bavarder'],
  objet:[''],
  reponse: "La sorcière vous raconte comment la saison froide a été rude pour elle l'an dernier."
},

]
},



sousbois: {
  name: "Un charmant sous-bois",
  image: "rooms/sousbois.png",
  initialDescription: "Le coin est paradisiaque. La fraicheur de la rivière scintillante vous désaltère la vue.",
  availDirections: [true, true, false, false],
  nextRooms: {
   'nord': 'pecheur',
   'est': 'riviere',
   'sud': '',
   'ouest': ''
 }, 
 actions: [
 {
   verbes: ['regarde'],
   objet: [''],
   reponse: "Avec cette pénombre, et la lumière qui filtre dans les feuilles des arbres, la rivière semble *vraiment* scintillante !"
 },
 {
   verbes: [''],
   objet: ['indice','aide'],
   reponse: "Pour vous enrichir, il faudra vous mouiller."
 },
 {
   verbes: ['boire'],
   objet: [''],
   reponse: "Vous voilà désaltéré."
 },
 {
   verbes: ['mettre'],
   objet: ['botte'],
   reponse: "Vous n'en avez pas."
 },
 {
   verbes: ['regarde'],
   objet: ['rivière'],
   reponse: "On dirait que quelque chose brille au fond. De l'or ?"
 },
 {
   verbes: ['fouiller'],
   objet: ['rivière','cours','lit'],
   reponse: "Vous découvrez des pépites d'or.",
   inventaire: {or:true}
 },
 {
   verbes: ['ramasser', 'prendre', 'récolter'],
   objet: ['or','pépites'],
   reponse: "Vous ramassez quelques pépites d'or.",
   inventaire: {or:true}
 },
 ]
},



pecheur: {
  name: "Le pécheur",
  image: "rooms/pecheur.png",
  initialDescription: "À l'ombre d'un arbre, un vieil homme surveille sa ligne.",
  availDirections: [true, true, true, false],
  nextRooms: {
   'nord': 'plaine',
   'est': 'fermes',
   'sud': 'sousbois',
   'ouest': ''
 }, 
 actions: [
 {
   verbes: ['regarde'],
   objet: [''],
   reponse: "Un vieil homme attend patiemment que le poisson morde. Il n'a pas l'air d'avoir eu beaucoup de succès jusqu'ici."
 },
 {
   verbes: [''],
   objet: ['bonjour'],
   reponse: "Surpris, le vieil homme sursaute en vous entendant. Il vous répond un bonjour timide."
 },
 {
   verbes: [''],
   objet: ['indice','aide'],
   reponse: "Il ne faut pas lui tirer les vers du nez."
 },
 {
   verbes: ['parler', 'discuter'],
   objet: ['pêcheur', 'homme', 'vieux', 'vieillard'],
   condition: '!game.inventaire.versdonnes.found',
   reponse: "Ça ne mord pas trop en ce moment. Mais je ne peux pas en vouloir aux poissons : je n'ai pas d'apât !"
 },  	
 {
   verbes: ['où', 'trouver'],
   objet: ['apâts', 'vers'],
   reponse: "D'habitude, je les déterre dans les plaines. Ils sont bien gros par là."
 },
 {
   verbes: ['parler', 'discuter'],
   objet: ['pêcheur', 'homme', 'vieux', 'vieillard'],
   condition: 'game.inventaire.versdonnes.found',
   reponse: "Merci encore pour les vers, mais il faut de la patience : le poisson ne mord pas si facilement vous savez."
 },  		
 {
   verbes: ['donner'],
   objet: ['vers', 'apât'],
   condition: 'game.inventaire.vers.found',
   reponse: "Pour vous remercier il vous donne un indice : Le phare revèle une porte la nuit !",
   inventaire: {vers:false, versdonnes: true}
 },
 {
   verbes: ['donner'],
   objet: ['vers', 'apât'],
   condition: 'game.inventaire.vers.found === false',
   reponse: "Vous n'en avez pas"
 },
 {
   verbes: ['où', 'trouver', 'connaissez'],
   objet: ['cimeric', 'sorcière'],
   reponse: "Dirigez-vous au Nord, puis à l'Ouest. Vous trouverez."
 },
 {
   verbes:[''],
   objet: ['merci'],
   reponse:"De rien, vous répond-t-il."
 },
 {
  verbes: ['bavarder'],
  objet:[''],
  reponse: "Vous en apprenez beaucoup sur les techniques de pèche, et sur les bons coins à poisson."
},
]
},



phare: {
  name: "Le phare",
  image: "rooms/phare.png",
  initialDescription: "Pour éviter aux bateaux de se fracasser sur des récifs, un phare a été érigé à cet endroit pour les guider.",
  availDirections : [false, false, true, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : 'falaises',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Même s'il est en réparation, il faudra attendre la nuit pour le voir fonctionner." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Il vous faut une idée lumineuse !" 
 },
 {
   verbes: ['attendre'],
   objet: ['nuit', 'obscurité'],
   reponse: "Le vent froid ne vous fait pas peur !",
   deplacement: 'pharenuit'
 },
 {
   verbes: ['entrer', 'visiter'],
   objet: ['phare'],
   reponse: "Il est fermé pendant les réparations."
 }
 ]
},



pharenuit: {
  name: "Le phare (nuit)",
  image: "rooms/pharenuit.png",
  initialDescription: "",
  availDirections : [false, false, true, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : 'falaises',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Le phare semble bloqué. La lumière pointe vers ce qui semble être l'entrée d'une cachette." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Suivez la lumière." 
 },
 {
   verbes: ['attendre'],
   objet: ['jour'],
   reponse: "L'obscurité ne vous fait pas peur !",
   deplacement: 'phare'
 },
 {
   verbes: ['entrer', 'aller', 'explorer'],
   objet: ['cachette'],
   reponse: "Vous vous faufilez",
   deplacement: 'cachette'
 },  		
 {
   verbes: ['entrer', 'visiter'],
   objet: ['phare'],
   reponse: "Le phare ne se visite pas la nuit. De plus, il est fermé pendant les réparations."
 }
 ]
},



cachette: {
  name: "Une cachette",
  image: "rooms/cachette.png",
  initialDescription: "Une petite grotte naturelle a été aménagée. Le coin semble néanmoins avoir été déserté.",
  availDirections : [false, false, false, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : '',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Sur l'unique meuble de la pièce, se trouve une bougie, une bourse en cuir et une feuille de papier." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Laissez votre cupidité l'emporter." 
 },
 {
   verbes: ['regarder'],
   objet:['bougie'],
   reponse: "Une bougie ordinaire, à moitié consumée." 
 },
 {
   verbes: ['prendre', 'saisir', 'emporter'],
   objet:['bougie'],
   reponse: "Cela peut toujours servir.",
   inventaire: {bougie:true} 
 },
 {
   verbes: ['allumer', 'utiliser'],
   objet:['bougie'],
   reponse: "Il fait asszez clair ici." 
 },
 {
   verbes: ['regarder', 'lire'],
   objet:['feuille', 'message','papier'],
   reponse: "Quelques mots griffonés, rendu flou par l'humidité. Impossible de lire." 
 },
 {
   verbes: ['regarder'],
   objet:['bourse'],
   reponse: "De mauvaise facture. Elle ne semble pas contenir grand chose." 
 },

 {
   verbes: ['fouiller','ramasser', 'saisir', 'prendre', 'ouvrir'],
   objet:['bourse'],
   reponse: "La bourse contient un cristal que vous empochez.",
   inventaire: {cristal:true}, 
 },
 {
   verbes: ['sortir'],
   objet: [''],
   reponse: "Vous filez en douce avant que quelqu'un ne vous trouve",
   deplacement: 'pharenuit'
 },
 ]
},



falaises: {
  name: "Les falaises de l'Est",
  image: "rooms/falaises.png",
  initialDescription: "Les falaises de craie sont hautes. Elles n'offrent malheureusement pas un aussi beau point de vue d'en haut que d'en bas.",
  availDirections : [true, false, true, true],
  nextRooms: {
   'nord': 'phare',
   'est': '',
   'sud' : 'plage',
   'ouest': 'plainechateau'
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Mieux vaut ne pas vous approcher trop du bord." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "" 
 },
 {
   verbes: ['sauter'],
   objet:[''],
   reponse: "Et abandonner ainsi le roi ? Pas question !" 
 },
 ]
},


plage: {
  name: "La plage au pied des falaises",
  image: "rooms/plage.png",
  initialDescription: "Les falaises de craie offrent un magnifique spectacle à celui qui sait l'apprécier.",
  availDirections : [true, false, true, true],
  nextRooms: {
   'nord': 'falaises',
   'est': '',
   'sud' : 'plagecoquillages',
   'ouest': 'fermes'
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Les vagues viennent se fracasser sur les rochers. Rien n'y résiste. Pas même la falaise qui se fait manger peu à peu." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "" 
 },
 ]
},



plagecoquillages: {
  name: "La plage au pied des falaises",
  image: "rooms/plagecoquillages.png",
  initialDescription: "Ici, la plage de sable se couvre de laisses de mer.",
  availDirections : [true, false, false, true],
  nextRooms: {
   'nord': 'plage',
   'est': '',
   'sud' : '',
   'ouest': 'riviere'
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Des coquillages jonchent le sol. Le ressac, moins fort ici, permet qu'ils restent en bon état, pour la plupart." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "C'est le moment de commencer une collection." 
 },
 {
   verbes: ['ramasser', 'prendre'],
   objet:['coquillage'],
   reponse: "Vous trouvez les plus beaux.",
   inventaire: {coquillage: true}
 },
 ]
},



victoire: {
  name: "Le grand hall du chateau",
  image: "rooms/victoire.png",
  initialDescription: "Le royaume fête votre victoire !",
  availDirections : [false, false, false, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : '',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "La foule se réjouit de la guérison du roi." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Le jeu est terminé." 
 },
 ]
},



mort: {
  name: "La mort",
  image: "rooms/mort.png",
  initialDescription: "Vous êtes mort !",
  availDirections : [false, false, false, false],
  nextRooms: {
   'nord': '',
   'est': '',
   'sud' : '',
   'ouest': ''
 },
 actions: [
 {
   verbes: ['regarder'],
   objet:[''],
   reponse: "Rien ne s'offre à vos yeux que les ténèbres." 
 },
 {
   verbes: [''],
   objet:['indice','aide'],
   reponse: "Le jeu est terminé. Rechargez la page pour recommencer." 
 },
 ]
},

},

},


// ============================================================
// METHODES
// ============================================================

methods: {

    // ============================================================
    // Initialisation du jeu
    // ============================================================
    init: function() {
    	this.currentLocation = 'chambreroi';
    },


    // ============================================================
    // Récupérer le texte tapé par le joueur quand il presse ENTREE
    // ============================================================
    getInput: function(event){
    	if(event.key == "Enter"){
    		var texte = event.target.value;
    		texte = texte.toLowerCase();
        /* 
        // retrait des accents
        texte = texte.replace(/(é|ê|è)/, 'e');
        texte = texte.replace(/(â|à)/,'a');
        texte = texte.replace(/(î)/,'i');
        */
        // retrait des accents


        // vider le champ
        event.target.value = '';
        // lancer l'analyse
        this.checkInput(texte);
      }
    },


    // ============================================================
    // Analyse du texte tapé par le joueur
    // ============================================================
    checkInput: function(input){

    	if(this.isDirection(input)){
        // Si le joueur a indiqué une direction
        // Cette direction est-elle valide dans ce lieu ?
        if(this.isDirectionValideHere(input)){
          // direction valide
          this.changeRoom(input);          

        }else{
          // direction invalide
          this.displayInfo = "Vous ne pouvez pas aller là"; 
        }


      }else{
        // Si l'utilisateur a tapé autre chose
        this.checkAction(input);
      }

    },


    // ============================================================
    // Le texte en paramètre est-il une direction ?
    // ============================================================    
    isDirection: function(dir){
      // l'input est-il une direction ?      
      var directionsWords = [
      'n', 'e', 's', 'o',
      'nord', 'est', 'sud','ouest'
      ];
      return directionsWords.includes(dir);
    },


    // ============================================================
    // La direction est-elle valide pour ce lieu ?
    // ============================================================
    isDirectionValideHere: function(dir){
      // Est-ce que cette direction est dans la liste des availDirection ?
      if (dir==='n' || dir==='nord'){direc=0;}
      if (dir==='e' || dir==='est'){direc=1;}
      if (dir==='s' || dir==='sud'){direc=2;}
      if (dir==='o' || dir==='ouest'){direc=3;}
      // retourne la valeur true/false de la liste
      return this.locations[this.currentLocation].availDirections[direc];
    },


    // ============================================================
    // Si le texte n'est pas une direction, c'est une action
    // ============================================================
    checkAction(action){
    	var curLoc = this.locations[this.currentLocation];
    	var conditionVerifieeOuAbsente = true;
    	var actionPlayable = 999;

      // pour chaque action possible dans ce lieu      
      for (var i = 0; i < curLoc.actions.length; i++){

        // On vérifie d'abord si une condition propre de l'action est présente et vérifiée
        if (curLoc.actions[i].condition){
        	var strExpr = curLoc.actions[i].condition; 
        	if (new Function("return " + strExpr)()){
        		conditionVerifieeOuAbsente = true;
        	}else{
        		conditionVerifieeOuAbsente = false;
        	}
        }else{
          // pas de condition dans cette action
          conditionVerifieeOuAbsente = true;
        }

        // Si la condition est vérifiée (ou absente), on vérifie la présence des mots
        if (conditionVerifieeOuAbsente){

          // on vérifie si la phrase contient un couple verbe-objet
          // presence d'un verbe connu
          var presVerbe = this.searchListInString(curLoc.actions[i].verbes, action);
          // presence d'un objet connu
          var presObjet = this.searchListInString(curLoc.actions[i].objet, action);

          // Si aucun mot n'est trouvé
          // …
          // Si un des deux mots est trouvé
          // …
          // TODO --> lancer une recherche dans les termes "universels"
          // Si les deux mots sont trouvés
          if (presVerbe && presObjet){
          	actionPlayable = i;
          }
        }

      } // fin de la boucle

      this.playAction(actionPlayable);
    },






    playAction: function(actionNum){
     var curAct = this.locations[this.currentLocation].actions[actionNum];

     if (actionNum === 999){
      this.displayInfo = "Essayez avec d'autres mots, ou vérifier l'orthographe.";
    }else{
      this.displayInfo = curAct.reponse;

      if (curAct.inventaire){

       var keys = Object.keys(curAct.inventaire);
       var values = Object.values(curAct.inventaire);          

          // Pour chaque élément de la ligne inventaire  
          // on modifie la valeur true/false
          for (var i = 0; i < keys.length; i++){
          	this.inventaire[keys[i]].found = values[i];
          }
        }

        if(curAct.deplacement){
         this.changeRoom(curAct.deplacement);
       }
     }


   },



    // ============================================================
    // Afficher l'info concernant ce nouveau lieu
    // ============================================================
    emptyLandingInfo: function(){    	
      this.displayInfo = '';
    },


    // ============================================================
    // Chercher une liste de mots dans un string
    // ============================================================
    searchListInString: function(list, string){
        // cherche les elements d'un tableau dans un string.
        // return true s'il trouve un de ces éléments.
        var presence = false;
        for (var i=0; i < list.length; i++){
        	if(string.includes(list[i])){
        		presence = true;
        		return presence;
        	};
        }
        return presence;
      },


    // ============================================================
    // Changer de lieu
    // ============================================================
    changeRoom: function(room){
    	if (room === 'n' || room === 'nord'){
    		this.currentLocation = this.locations[this.currentLocation].nextRooms.nord;   
    	}
    	else if (room === 's' || room === 'sud'){
    		this.currentLocation = this.locations[this.currentLocation].nextRooms.sud;    
    	}
    	else if (room === 'e' || room === 'est'){
    		this.currentLocation = this.locations[this.currentLocation].nextRooms.est;   
    	}
    	else if (room === 'o' || room === 'ouest'){
    		this.currentLocation = this.locations[this.currentLocation].nextRooms.ouest;  
    	} else {
    		this.currentLocation = room;
      }      

      this.emptyLandingInfo();      
    }

  },

  // ============================================================
  // AU CHARGEMENT DU DOM TERMINÉ
  // ============================================================

  mounted: function(){
  	this.init();
  	document.getElementById("inputbox").focus();
  },

  // ============================================================
  // VALEURS COMPUTÉES
  // ============================================================
  
  computed: {},
  
  // ============================================================
  // FILTRES
  // ============================================================
  
  filters: {
  	formatGameName: function(value) {
  		value = value.toString();
  		value = '.: ' + value + ' :.'
  		return value;
  	},
  	toUpperCase: function(value) {
  		return value.toUpperCase();
  	},
  	reductNumber: function(value) {
  		return value.toFixed(2);
  	}
  }
});
