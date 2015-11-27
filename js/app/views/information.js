var Information = function(){

    this.id = 'information';

    View.apply(this, arguments);

    this.images = {
        'experience-background': 'img/home-bg.jpg'
    };

};

Information.prototype = Object.create(View.prototype);

Information.prototype.animateIn = function() {

    View.prototype.animateIn.call(this);

    var self = this;

    if ( !this.loaded ) return;

    this.domElem.fadeIn(function(){
        self.onAnimateIn();
    });
};

Information.prototype.animateOut = function() {

    View.prototype.animateOut.call(this);

    var self = this;

    this.domElem.fadeOut(function(){
        self.onAnimateOut();
    });
};

Information.prototype.onAnimateIn = function() {

    var problem = document.getElementById('problem');
    var soluce  = document.getElementById('solution');
    var no      = document.getElementById('text-NordOuest');
    var ne      = document.getElementById('text-NordEst');
    var se      = document.getElementById('text-SudEst');
    var so      = document.getElementById('text-SudOuest');
    var change  = document.getElementById('change-screen-map');
    var no_sol  = document.getElementById('text-NordOuest-sol');
    var ne_sol  = document.getElementById('text-NordEst-sol');
    var se_sol  = document.getElementById('text-SudEst-sol');
    var so_sol  = document.getElementById('text-SudOuest-sol');
    var ch_sol  = document.getElementById('change-screen-map-sol');
    var afr     = document.getElementById('map-africa');
    var ads     = document.getElementById('map-south-africa');
    var pbsol   = document.getElementById('problem-solution');
    var go      = document.getElementById('lancement');


    go.addEventListener('click', grow);
    ads.addEventListener('click', grow);
    change.addEventListener('click', afficher_soluces);
    ch_sol.addEventListener('click', afficher_soluces);

    //fonction grow permet de grossir l'Afrique du Sud et d'afficher les problèmes et solutions liés
    function grow(){
        change.classList.add('app-change');
        so.classList.add('app-bas');
        se.classList.add('app-droite');
        ne.classList.add('app-haut');
        no.classList.add('app-gauche');
        ch_sol.classList.add('app-change');
        so_sol.classList.add('app-bas');
        se_sol.classList.add('app-droite');
        ne_sol.classList.add('app-haut');
        no_sol.classList.add('app-gauche');
        afr.classList.add('invisible');
        go.classList.add('invisible');
        ads.classList.add('big');
        pbsol.classList.add('visible');
        ads.removeEventListener('click', grow);
        ads.addEventListener('click', shrink);
    }

    //la fonction shrink permet de réduire l'Afrique du Sud pour lui faire réintégrer sa taille petite
    function shrink() {
        change.classList.remove('app-change');
        so.classList.remove('app-bas');
        se.classList.remove('app-droite');
        ne.classList.remove('app-haut');
        no.classList.remove('app-gauche');
        ch_sol.classList.remove('app-change');
        so_sol.classList.remove('app-bas');
        se_sol.classList.remove('app-droite');
        ne_sol.classList.remove('app-haut');
        no_sol.classList.remove('app-gauche');
        afr.classList.remove('invisible');
        ads.classList.remove('big');
        pbsol.classList.remove('visible');
        go.classList.remove('invisible');
        ads.removeEventListener('click', shrink);
        ads.addEventListener('click', grow);
    }

    //cette fonction permet de passer de l'écran problemes à l'écran solution
    function afficher_soluces(){
        soluce.classList.add('affich');
        problem.classList.add('masque');
        change.removeEventListener('click', afficher_soluces);
        ch_sol.removeEventListener('click', afficher_soluces);
        change.addEventListener('click', afficher_problem);
        ch_sol.addEventListener('click', afficher_problem);
    }

    //cette fonction permet de passer de l'écran solutions à l'écran problemes
    function afficher_problem(){
        soluce.classList.remove('affich');
        problem.classList.remove('masque');
        change.removeEventListener('click', afficher_problem);
        change.addEventListener('click', afficher_soluces);
        ch_sol.removeEventListener('click', afficher_problem);
        ch_sol.addEventListener('click', afficher_soluces);
    }
}