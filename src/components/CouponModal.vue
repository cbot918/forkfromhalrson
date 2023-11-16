<template>
  <div class="modal fade" ref="DOM">
    <div class="modal-dialog" role="dialog">
      <Form class="modal-content" v-slot="{errors}" v-on:submit="addEditCoupon" v-on:reset="hide">
        <div class="modal-header">{{coupon.id?'編輯':'新增'}}優惠券</div>
        <div class="modal-body">
          <table class="w-100">
            <tr>
              <td>標題</td>
              <td>
                <Field label="標題" name="title" class="form-control" type="text" rules="required" v-model="coupon.title" v-bind:class="{'is-invalid':errors['title']}"/>
                <ErrorMessage name="title" class="invalid-feedback"/>
              </td>
            </tr>
            <tr>
              <td>代碼</td>
              <td>
                <Field label="代碼" name="code" class="form-control" type="text" rules="required" v-model="coupon.code" v-bind:class="{'is-invalid':errors['code']}" />
                <ErrorMessage name="code" class="invalid-feedback" />
              </td>
            </tr>
            <tr>
              <td>折扣</td>
              <td>
                <Field label="折扣" name="discount" class="form-control" type="number" rules="required|integer" min="1" max="99" v-model.number="coupon.percent" v-bind:class="{'is-invalid':errors['discount']}" />
                <ErrorMessage name="discount" class="invalid-feedback" />
              </td>
            </tr>
            <tr>
              <td>到期日</td>
              <td>
                <Field label="到期日" name="due_date" class="form-control" type="date" rules="required" v-model="_date.toISOString().split('T')[0]" v-bind:class="{'is-invalid':errors['due_date']}" />
                <ErrorMessage name="due_date" class="invalid-feedback" />
              </td>
            </tr>
            <tr>
              <td>啟用</td>
              <td>
                <Field label="啟用" name="enabled" class="form-check-input" type="checkbox" rules="required" v-model="coupon.is_enabled" v-bind:value="1" v-bind:unchecked-value="0" v-bind:class="{'is-invalid':errors['enabled']}" />
                <ErrorMessage name="enabled" class="invalid-feedback" />
              </td>
            </tr>
          </table>
        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">確定</button>
          <button type="reset" class="btn btn-danger">取消</button>
        </div>
      </Form>
    </div>
  </div>
</template>
<script setup>
  import { defineExpose, defineProps, onMounted, ref, watch } from "vue";
  import { Modal } from "bootstrap"
  import { storeToRefs } from "pinia";
  import useCouponStore from "@/stores/coupons"
  const DOM = ref(null)
  const prop = defineProps(['coupon'])
  const CouponStore = useCouponStore(), { addCoupon, editCoupon } = CouponStore,{coupon}=storeToRefs(CouponStore)
  let modal, _date = new Date()
  defineExpose({ show })
  onMounted(function () {
    modal = new Modal(DOM.value)
  })
  watch(
    () => prop.coupon,
    function (newValue) {
      coupon.value = {...newValue}
      _date.setTime(coupon.value.due_date??Date.now())
    },
    { deep: true }
  )  
  function show () { modal.show() }
  function hide () { modal.hide() }
  function addEditCoupon () {
    coupon.value.due_date=_date.getTime()
    if (coupon.value.id) { editCoupon(coupon) } else { addCoupon(coupon) }
  }
</script>
