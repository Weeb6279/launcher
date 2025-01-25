<div class="loader">
  <div class="main-body"></div>
  <div class="orb-wrapper">
    <div class="orb1 orb"></div>
    <div class="orb2 orb"></div>
    <div class="orb3 orb"></div>
    <div class="orb4 orb"></div>
  </div>
</div>

<style lang="postcss">
  .loader {
    width: calc(100px - 24px);
    height: 50px;
    position: relative;
  }

  .loader .orb {
    content: "";
    position: absolute;
    inset: 0;
    margin: auto;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: red;
    transform-origin: -24px 50%;
    animation: spin 2s infinite linear;
    z-index: 10;
  }

  .orb3 {
    animation-delay: -1s!important;
  }

  .loader .main-body {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50% , -50%);
    background: orange;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    z-index: 20;
  }

  @keyframes spin {
    25% {
      transform: translateX(-78px) rotate(90deg);
    }

    50% {
      transform: translateX(0) rotate(180deg);
      z-index: 30;
    }

    75% {
      transform: translateX(100px) rotate(270deg);
    }

    100% {
      transform: translateX(0) rotate(0);
      z-index: 10;
    }
  }
</style>