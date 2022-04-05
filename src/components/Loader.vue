<template>
    <div id="loader">
        <div class="spinner-border text-primary" role="status"></div>
    </div>
</template>
<style lang="scss">
    #loader {
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background: rgba(255,255,255,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 100;
    }
</style>