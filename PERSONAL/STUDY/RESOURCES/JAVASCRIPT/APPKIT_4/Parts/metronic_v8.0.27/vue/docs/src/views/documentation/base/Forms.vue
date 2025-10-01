<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card Body-->
    <div class="card-body fs-6 py-15 px-10 py-lg-15 px-lg-15 text-gray-700">
      <Overview></Overview>

      <CustomFormControl></CustomFormControl>

      <FlushFormControls></FlushFormControls>

      <FormLabels></FormLabels>

      <CustomFormSelect></CustomFormSelect>

      <CustomCheckboxAndRadio></CustomCheckboxAndRadio>

      <CustomSwitch></CustomSwitch>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { setCurrentPageBreadcrumbs } from "@/core/helpers/breadcrumb";
import Overview from "@/views/documentation/base/forms/Overview.vue";
import CustomFormControl from "@/views/documentation/base/forms/CustomFormControl.vue";
import FlushFormControls from "@/views/documentation/base/forms/FlushFormControls.vue";
import FormLabels from "@/views/documentation/base/forms/FormLabels.vue";
import CustomFormSelect from "@/views/documentation/base/forms/CustomFormSelect.vue";
import CustomCheckboxAndRadio from "@/views/documentation/base/forms/CustomCheckboxAndRadio.vue";
import CustomSwitch from "@/views/documentation/base/forms/CustomSwitch.vue";

export default defineComponent({
  name: "forms",
  components: {
    Overview,
    CustomFormControl,
    FlushFormControls,
    FormLabels,
    CustomFormSelect,
    CustomCheckboxAndRadio,
    CustomSwitch,
  },
  setup() {
    onMounted(() => {
      setCurrentPageBreadcrumbs("Forms", ["Base"]);
    });
  },
});
</script>
