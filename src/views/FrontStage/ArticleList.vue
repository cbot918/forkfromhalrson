<template>
  <loading v-bind:is-full-page="true" v-bind:active="isLoading" />
  <div class="container">
    <div class="row">
      <nav class="col-3 bg-light float-start">
        <div class="position-sticky pt-3">
          <p>標籤篩選</p>
          <p class="form-check" v-for="tag in tags" v-bind:key="tag">
            <input class="form-check-input" type="checkbox" v-bind:value="tag" v-on:change="filtering($event.target.checked?$event.target.value:'')" />
            <label class="form-check-label" v-text="tag"></label>
          </p>
        </div>
      </nav>
      <div class="col-9 mt-1">
        <div class="card-group row">
          <div class="col-6 row" v-for="article in filterArticles" v-bind:key="article.id">
            <ArticleCard v-bind:article="article" />
          </div>
        </div>
      </div>
    </div>
    <Pagination v-bind:pagination="pagination" v-show="pagination.total_pages>1" v-on:paginate="page=>getArticles(page,'customer')" />
  </div>
</template>
<script setup>
  import useArticleStore from '@/stores/articles'
  import useLoadingStore from "@/stores/loading"
  import ArticleCard from '@/components/ArticleCard.vue'
  import Pagination from '@/components/PaginationBar.vue'
  import { storeToRefs } from 'pinia'
  import {  onMounted, ref } from 'vue'
  const ArticleStore = useArticleStore(), { getArticles } = ArticleStore, { articles, pagination } = storeToRefs(ArticleStore), { isLoading } = storeToRefs(useLoadingStore())
  const tags =ref([]),filterArticles=ref([])
  onMounted(async function () {
    await getArticles(1, 'customer')
  })
  tags.value =Array.from(new Set(articles.value.flatMap(article=>article.tag))).filter(tag=>!!tag)
  filtering('')
  function filtering(tag){
    filterArticles.value = tag === '' ? articles.value :articles.value.filter(article=>article?.tag||[].includes(tag))
  }
</script>