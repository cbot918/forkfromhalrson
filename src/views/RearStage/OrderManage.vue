<template>
  <loading v-bind:is-full-page="true" v-bind:active="isLoading" />
  <div class="table-responsive">
    <button class="btn btn-danger float-end" v-on:click="openModal('clear')">刪除所有訂單</button>
    <table class="table table-striped table-sm">
      <thead>
        <tr>
          <th>訂單編號</th>
          <th>建立日期</th>
          <th>付款方式</th>
          <th>付款日期</th>
          <th>動作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="o in orders" v-bind:key="o.num">
          <td v-text="o.id"></td>
          <td v-text="date(o.create_at*1000)"></td>
          <td>{{o.payment_method||'尚未付款'}}</td>
          <td>{{o.paid_date?date(o.paid_date*1000):'尚未付款'}}</td>
          <td>
            <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
              <button class="btn btn-outline-primary" v-on:click="openModal('edit',o.id)">編輯</button>
              <button class="btn btn-outline-danger" v-on:click="openModal('remove',o.id)">移除</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination v-bind:pagination="pagination" v-show="pagination.total_pages>1" v-on:paginate="page=>getOrders(page,'admin')"/>
    <OrderModal v-bind:id="order.id" type="admin" ref="editModal" />
    <RemoveModal v-bind:item="order" v-bind:type="type" ref="removeModal" />
  </div>
</template>
<script setup>
  import { storeToRefs } from "pinia"
  import { onMounted, ref } from "vue"
  import { date } from "../../util"
  import OrderModal from "@/components/OrderModal.vue"
  import RemoveModal from "@/components/RemoveModal.vue"
  import Pagination from "@/components/PaginationBar.vue"
  import useLoadingStore from "@/stores/loading"
  import useOrderStore from "@/stores/orders"
  const editModal = ref(null), removeModal = ref(null),type=ref('')
  const { isLoading } = storeToRefs(useLoadingStore())
  const orderStore = useOrderStore(), { getOrders } = orderStore, { orders, pagination } = storeToRefs(orderStore), order = ref({})
  onMounted(function () {
    getOrders(1, 'admin')
  })
  function openModal (action, id='') {
    order.value = orders.value.find(o => o.id === id)||{}
    if (action === 'edit') {
      editModal.value.show()
    } else if(action==='remove'){
      type.value='單一訂單'
      removeModal.value.show()
    }else {
      type.value = '所有訂單'
      removeModal.value.show()
    }
  }
</script>
