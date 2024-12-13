const app = Vue.createApp({
    data() {
        return {
            hero: null,
            searchId: '',  // L'ID saisi dans la barre de recherche
            loading: false,
            error: false,
        };
    },
    mounted() {
        // Charger la barre de navigation
        this.loadNavbar();

        // Vérifier si un ID est passé dans l'URL
        const urlParams = new URLSearchParams(window.location.search);
        const heroId = urlParams.get('id');

        // Si un ID est dans l'URL, charger les détails du super-héros
        if (heroId) {
            this.getHeroDetails(heroId);
        }
    },
    methods: {
        // Fonction pour récupérer les détails du super-héros par ID
        getHeroDetails(heroId) {
            this.loading = true;
            this.error = false;

            axios.all([
                axios.get(`https://raw.githubusercontent.com/rtomczak/superhero-api/0.3.0/api/id/${heroId}.json`),
                axios.get(`https://raw.githubusercontent.com/rtomczak/superhero-api/0.3.0/api/powerstats/${heroId}.json`),
                axios.get(`https://raw.githubusercontent.com/rtomczak/superhero-api/0.3.0/api/appearance/${heroId}.json`),
                axios.get(`https://raw.githubusercontent.com/rtomczak/superhero-api/0.3.0/api/biography/${heroId}.json`)
            ])
                .then(axios.spread((heroResponse, powersResponse, appearanceResponse, biographyResponse) => {
                    this.hero = {
                        ...heroResponse.data,
                        powers: powersResponse.data,
                        appearance: appearanceResponse.data,
                        biography: biographyResponse.data,
                        image: heroResponse.data.images.md // Utilisation de la propriété images.md
                    };
                    this.loading = false;
                }))
                .catch(error => {
                    console.error('Erreur lors de la récupération des détails du super-héros :', error);
                    this.loading = false;
                    this.error = true;
                });
        },

        // Fonction pour rechercher un super-héros en utilisant l'ID saisi
        searchHero() {
            if (this.searchId) {
                this.getHeroDetails(this.searchId);
            }
        },

        // Fonction pour charger la barre de navigation
        loadNavbar() {
            fetch('navbar.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('navbar-placeholder').innerHTML = data;
                })
                .catch(error => console.error('Erreur de chargement de la barre de navigation :', error));
        }
    }
});

app.mount('#app');
