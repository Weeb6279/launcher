<script lang="ts">
import jak19am from "$assets/images/jak1/9am.webp";
import jak29am from "$assets/images/jak2/9am.webp";
</script>

<div class="images pointer-events-none">
  <div class="gradient-overlay"></div>
  <img id="jak1" src={jak19am} />
  <img id="jak2" src={jak29am} />
</div>

<style>

    .splash-container .images {
        @apply relative flex w-full h-full;
    }

    .splash-container .images img#jak1 {
        transition: all 0.3s ease;
        @apply absolute top-0 left-0 h-full w-[55%];
        clip-path: polygon(0% 0%, 99.5% 0%, 81.5% 100%, 0% 100%);
    }

    .splash-container .images img#jak2 {
        transition: all 0.3s ease;
        @apply absolute top-0 right-0 h-full w-[55%];
        clip-path: polygon(18.5% 0%, 100% 0%, 100% 100%, 0.5% 100%);
    }

    .splash-container .images .gradient-overlay {
        @apply absolute left-0 top-0 w-full h-full z-10;
        background-image: radial-gradient(
                circle at center,
                rgb(27, 27, 29, 1) 0%,
                rgb(27, 27, 29, 0.75) 30%,
                rgba(27, 27, 29, 0.15) 60%
        );
    }

    .splash-container .images img {
        object-fit: cover;
        transition: opacity 0.5s ease;
        opacity: 1;
    }

</style>