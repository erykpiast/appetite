<section class="thumbnail offer-thumbnail" ng-click="goTo('offer', { id: {{ offer.id }} })">
		
	<header class="thumbnail--text__top">
		<h3>{{ offer.template.title }}</h3>
	</header>

	<div class="thumbnail--background">
		<img ng-src="/images/{{ offer.template.pictures[0].filename }}" />
	</div>

	<footer class="thumbnail--text__bottom">
		<p>{{ offer.template.description }}</p>
	</footer>

</section>