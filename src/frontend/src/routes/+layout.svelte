
<script >
	import {Content, HeaderTitle} from '@dfinity/gix-components';

</script>

<Content>
	<HeaderTitle slot="title">My dapp page</HeaderTitle>
  
	<main>
	  <slot />
	</main>
  </Content>

<style lang="scss" global>
	@import '@dfinity/gix-components/dist/styles/global.scss';
	
</style>
