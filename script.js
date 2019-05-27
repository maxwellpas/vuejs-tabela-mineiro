/**
 * O ideal ser criar um arquivo com filtros globais, ate porque para aplicações grandes seria inviável
 */

Vue.filter('ucwords', function (valor) {
    return valor.charAt(0).toUpperCase() + valor.slice(1);
});

Vue.component('titulo', {
    template: `
    <div class="row mt-5 mb-5">
        <div class="col-md-12">
            <h1 class="text-center">VueJs - Tabela do Mineiro</h1>
        </div>
    </div>
    `
});

Vue.component('clube', {
    props: ['time', 'invertido'],
    template: `
    <div style="display: flex; flex-direction: row">
        <img class="img-time ml-2 mr-2" :src="time.escudo" :style="{order: invertido == 'true' ? '2' : '1'}" alt=""> 
        <span :style="{order: invertido == 'true' ? '1' : '2'}">{{ time.nome | ucwords}}</span>
    </div>
    `,
    methods: {
        metodo() {
            return this.nome;
        }
    },
    /**
    filters: {
        ucwords(valor) {
            return valor.charAt(0).toUpperCase() + valor.slice(1);
        }
    }
     */
});

Vue.component('time-classifidados',{
    props: ['times'],/** Essa props está senda usada no computed */
    template: `
    <div class="col-6">
        <h3>Times Classificados para Libertadores</h3>
        <ul>
            <li v-for="time in timeLibertadores">
                <clube :time="time"></clube>
            </li>
        </ul>
    </div>
    `,
    computed: {
        timeLibertadores() {
            return this.times.slice(0, 6);
        }
    }
});


Vue.component('time-rebaixados',{
    props: ['times'], /** Essa props está senda usada no computed */
    template: `
    <div class="col-6">
        <h3>Times Rebaixados</h3>
        <ul>
            <li v-for="time in timeRebaixados">
                <clube :time="time"></clube>
            </li>
        </ul>
    </div>
    `,
    computed: {
        timeRebaixados() {
            return this.times.slice(16, 20);
        }
    }
});

Vue.component('tabela-clubes',{
    props: ['times'],
    data() {
        return {
            busca: '',
            ordem: {
                colunas: ['pontos', 'gm', 'gs', 'saldo'],
                orientacao: ['desc', 'desc', 'asc', 'desc']
            }
        };
    },
    template: `
        
        <div class="col-12">
            <input type="text" class="form-control mb-3 mt-3" v-model="busca" placeholder="Digite aqui para fazer a busca">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Nome</th>
                        <th scope="col" v-for="(coluna, indice) in ordem.colunas">
                            <a href="#" @click.prevent="ordenar(indice)">
                                {{ coluna | ucwords}}
                            </a>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(time, indice) in timeFiltrados" :class="{'table-success': indice < 6}" :style="{'font-size': indice < 6 ? '18px' : '14px'}">
                        <th scope="row">{{ indice }}</th>
                        <td>
                            <clube :time="time"></clube>
                        </td>
                        <td>{{ time.pontos }}</td>
                        <td>{{ time.gm }}</td>
                        <td>{{ time.gs }}</td>
                        <td>{{ time.saldo}}</td>
                    </tr>
                </tbody>
            </table>
            <time-classifidados :times="timeOrdenados"></time-classifidados>
            <time-rebaixados :times="timeOrdenados"></time-rebaixados>
        </div>      
    `,
    computed: {
        /**
        totalJogo() {
            return parseInt(this.novoJogo.casa.gols) + parseInt(this.novoJogo.fora.gols)
        },
        */
        timeFiltrados() {
            
            var self = this;

            return _.filter(this.timeOrdenados, function(time) {
                var busca = self.busca.toLowerCase();
                return time.nome.toLowerCase().indexOf(busca) >= 0;
            });
        },
        timeOrdenados() {
            return _.orderBy(this.times, this.ordem.colunas, this.ordem.orientacao);
        }
    },
    methods: {
        ordenar(indice) {
            this.$set(this.ordem.orientacao, indice, this.ordem.orientacao[indice] == 'desc' ? 'asc' : 'desc')
        }
    }
});


Vue.component('novo-jogo', {
    props: ['timeCasa', 'timeFora'],
    data() {
        return {
            golsCasa: 0,
            golsFora: 0
        }
    },
    template: `
        <form class="form-inline">
            <input type="text" class="form-control col-1 mr-2" v-model="golsCasa">                 
            <clube :time="timeCasa" invertido="true"></clube>
            <span class="mr-2 ml-2">X</span>
            <clube :time="timeFora"></clube>
            <input type="text" class="form-control col-1 ml-2" v-model="golsFora">
            <!---input type="text" :value="totalJogo">-->
            <button type="button" class="btn btn-danger ml-4" @click="fimJogo">Fim do Jogo</button>
        </form>
    `,
    methods: {
        fimJogo() {
            var golsMarcados = parseInt(this.golsCasa);
            var golsSofridos = parseInt(this.golsFora);          

            this.timeCasa.fimJogo(this.timeFora, golsMarcados, golsSofridos);
            this.$emit('fim-jogo', {golsCasa: this.golsCasa, golsFora: this.golsFora});

        }
    }
});

new Vue({
    el: "#app",
    data: {
        times: [
            new Time('palmeiras', 'assets/palmeiras_60x60.png'),
            new Time('Internacional', 'assets/internacional_60x60.png'),
            new Time('Flamengo', 'assets/flamengo_60x60.png'),
            new Time('Atlético-MG', 'assets/atletico_mg_60x60.png'),
            new Time('Santos', 'assets/santos_60x60.png'),
            new Time('Botafogo', 'assets/botafogo_60x60.png'),
            new Time('Atlético-PR', 'assets/atletico-pr_60x60.png'),
            new Time('Corinthians', 'assets/corinthians_60x60.png'),
            new Time('Grêmio', 'assets/gremio_60x60.png'),
            new Time('Fluminense', 'assets/fluminense_60x60.png'),
            new Time('Bahia', 'assets/bahia_60x60.png'),
            new Time('Chapecoense', 'assets/chapecoense_60x60.png'),
            new Time('São Paulo', 'assets/sao_paulo_60x60.png'),
            new Time('Cruzeiro', 'assets/cruzeiro_60x60.png'),
            new Time('Sport', 'assets/sport_60x60.png'),
            new Time('Ceará', 'assets/ceara_60x60.png'),
            new Time('Vitória', 'assets/vitoria_60x60.png'),
            new Time('Vasco', 'assets/vasco_60x60.png'),
            new Time('América-MG', 'assets/america_mg_60x60.png'),
            new Time('Paraná', 'assets/parana_60x60.png'),
        ],
        timeCasa: null,
        timeFora: null,
        visao: 'tabela'
    },
    
    methods: {
        criarNovoJogo() {
            var indiceCasa = Math.floor(Math.random() * 20),
                indiceFora = Math.floor(Math.random() * 20);

            this.timeCasa = this.times[indiceCasa];            
            this.timeFora = this.times[indiceFora];
            

            console.log(this.novoJogo);
            this.visao = 'placar';
        },
        showTabela(event){
            console.log(event);
            this.visao = 'tabela';
        }
    },
    filters: {
        saldo(time) {
            var ret = time.gm - time.gs;
            return ret < 0 ? 0 : ret;
        }
        /**
         * Podes ser colocado aqui ou commo um Filter global
        ,
        ucwords(valor) {
            return valor.charAt(0).toUpperCase() + valor.slice(1);
        }
         */
    }
});