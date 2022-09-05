<template>
  <div>
    <div class="d-flex align-center">
      <input
        type="text"
        @input="handleInput"
        :placeholder="this.movies.length"
      />
      <AddMovie />
    </div>

    <ul>
      <li v-for="movie in moviesToShow" :key="movie">
        <v-row>
          <v-col>
            {{ movie.title }}
          </v-col>
          <v-col cols="auto">
            <b>
              {{ movie.director }}
            </b>
          </v-col>
          <v-col cols="auto">
            {{ movie.production_year }}
          </v-col>
        </v-row>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { getMovies, Movie } from "@/api/movies";
import AddMovie from "@/components/AddMovie.vue";
import { Fzf, FzfResultItem } from "fzf";
import { defineComponent } from "vue";

export default defineComponent({
  name: "MovieList",
  components: {
    AddMovie,
  },
  data() {
    return {
      movies: [] as Movie[],
      result: [] as FzfResultItem<Movie>[],
      loading: true,
      showResult: false,
      error: null,
      fzf: null as Fzf<Movie[]> | null,
    };
  },
  mounted() {
    Promise.all([this.fetchMovies()]);
  },
  computed: {
    moviesToShow() {
      if (this.showResult) {
        return (this as any).result.map((item: FzfResultItem) => item.item);
      } else {
        return (this as any).movies;
      }
    },
  },
  methods: {
    async fetchMovies() {
      this.movies = await getMovies();
      this.fzf = new Fzf(this.movies, {
        limit: 22,
        casing: "case-insensitive",
        selector: (item) => item.title,
      });
    },
    handleInput(event: Event) {
      const input = event.target as HTMLInputElement;
      if (input.value.length === 0) {
        this.showResult = false;
        return;
      }

      const result = this.fzf!.find(input.value);

      if (result.length > 0) {
        this.result = result;
        this.showResult = true;
      } else {
        this.showResult = false;
      }
    },
  },
});
</script>

<style scoped>
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 6px;
  border-bottom: 1px solid #ccc;
}
</style>
