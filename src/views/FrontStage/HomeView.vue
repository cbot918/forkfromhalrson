<template>
  <loading v-bind:is-full-apge="true" v-bind:active="isLoading" />
  <div class="row justify-content-center my-auto">
    <div class="col-md-4 text-center">
      <h2>Zay 生活用品店</h2>
      <p class="text-muted mb-0">你的品味，由你創造</p>
      <button class="btn btn-dark rounded-0 mt-6" v-on:click="getDiscount">立即搶折扣</button>
    </div>
  </div>
  <div class="row mt-5">
    <div class="col-md-4 mt-md-4" v-for="product in filterProducts" v-bind:key="product.id">
      <ProductCard v-bind:product="product">
        <template v-slot:body class="text-center">
          <div class="card-body ">
            <h4 v-text="product.title"></h4>
            <div class="d-flex justify-content-between">
              <p class="card-text text-truncate mb-0" v-text="product.content"></p>
            </div>
          </div>
        </template>
      </ProductCard>
    </div>
  </div>
  <div class="bg-light my-2">
    <Carousel v-bind:items="Comments" v-slot="{items}">
      <div class="carousel-item my-5" v-for="comment,index in items" v-bind:key="index" v-bind:class="{'active':index===0}">
        <div class="py-7 text-center">
          <h3 v-text="comment.message"></h3>
          <p>
            <small>—{{comment.author}}—</small>
          </p>
        </div>
      </div>
    </Carousel>
  </div>
  <div class="row my-2 m-auto" v-for="article in filterArticles">
    <ArticleCard v-bind:article="article" />
  </div>
  <div class="bg-light py-4" id="discount-area">
    <div class="container">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center align-items-start">
        <div class="input-group w-md-50 mt-md-0 mt-3">
          <p class="me-1 fw-bold my-auto">輸入即享二折優惠</p>
          <input type="text" class="form-control rounded-0" value="anniversity" readonly />
          <div class="input-group-append">
            <button class="btn btn-dark rounded-0" type="button" v-on:click="copyDiscountCode">
              複製折扣碼
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import useLoadingStore from "@/stores/loading"
  import useProductStore from "@/stores/products"
  import useArticleStore from "@/stores/articles"
  import ProductCard from "@/components/ProductCard.vue"
  import Carousel from "@/components/CarouselComponent.vue"
  import ArticleCard from "@/components/ArticleCard.vue"
  import Comments from "@/stores/comments.json"
  import { storeToRefs } from 'pinia'
  import { computed, onMounted, ref } from "vue"
  const { isLoading } = storeToRefs(useLoadingStore())
  const ProductStore = useProductStore(), { getProducts } = ProductStore, { products } = storeToRefs(ProductStore)
  const ArticleStore = useArticleStore(), { getArticles } = ArticleStore, { articles } = storeToRefs(ArticleStore)
  const filterProducts = ref([]), filterArticles =ref([])
  onMounted(async function () {
    await getProducts(1, 'customer')
    await getArticles(1, 'customer')
  })
 filterProducts.value= [...products.value].sort(() => Math.random() - 0.5).splice(0, 3)
  filterArticles.value= [...articles.value].sort(() => Math.random() - 0.5).splice(0, 2)
  function getDiscount(){
    document.getElementById("discount-area").scrollIntoView()
  }
  function copyDiscountCode () {
    navigator.clipboard.writeText('aniversity')
  }
</script>
<style scoped>
  h1 {
    font-weight: 500;
    font-size: 2.6rem;
    position: relative;
    top: -10px;
  }

  h3 {
    font-size: 1.2rem;
  }

  .greetings h1,
  .greetings h3 {
    text-align: center;
  }

  @media (min-width: 1024px) {
    .greetings h1,
    .greetings h3 {
      text-align: left;
    }
  }
</style>