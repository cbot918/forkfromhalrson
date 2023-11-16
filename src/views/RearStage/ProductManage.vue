<template>
  <loading v-bind:is-full-page="true" v-bind:active="isLoading" />
  <button type="button" class="btn btn-primary float-end" v-on:click="openModal('add')">新增商品</button>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th width="200">產品名稱</th>
        <th width="120" class="text-end">原價</th>
        <th width="120" class="text-end">售價</th>
        <th width="100">是否啟用</th>
        <th>編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in products" v-bind:key="p.id">
        <td v-text="p.category"></td>
        <td v-text="p.title"></td>
        <td v-text="currency(p.origin_price)" class="text-end"></td>
        <td v-text="currency(p.price)" class="text-end"></td>
        <td v-bind:class="p.is_enabled===1?'text-success':text-danger">
          <span v-text="`${p.is_enabled===1?'啟':'停'}用`"></span>
        </td>
        <td>
          <div class="btn-group">
            <button v-on:click="openModal('modify',p.id)" class="btn btn-outline-primary btn-sm">編輯</button>
            <button v-on:click="openModal('remove',p.id)" class="btn btn-outline-danger btn-sm">移除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <Pagination v-bind:pagination="pagination"  v-show="pagination.total_pages>1" v-on:paginate="page=>getProducts(page,'admin')"/>
  <ProductModal v-bind:id="product.id" ref="addEditModal" />
  <RemoveModal v-bind:item="product" type="產品" ref="removeModal" />
</template>
<script setup>
  import { onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
import useProductStore from '@/stores/products'
  import useLoadingStore from "@/stores/loading"
  import Pagination from "@/components/PaginationBar.vue"
import ProductModal from '@/components/ProductModal.vue'
  import RemoveModal from '@/components/RemoveModal.vue'
  import{currency} from "../../util"
  const { isLoading } = storeToRefs(useLoadingStore())
  const ProductStore = useProductStore(), { getProducts } = ProductStore, { products, pagination } = storeToRefs(ProductStore)
  const product = ref({}), addEditModal = ref(null), removeModal = ref(null)
  onMounted(function () {
    getProducts(1, 'admin')
  })
  function openModal (action, id = '') {
    switch (action) {
      case 'add':
        product.value = {}
        addEditModal.value.show()
        break
      case 'modify':
        product.value = products.value.find(p => p.id === id)
        addEditModal.value.show()
        break
      case 'remove':
        product.value = products.value.find(p => p.id === id)
        removeModal.value.show()
        break
    }
  }
</script>
