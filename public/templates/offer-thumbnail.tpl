<section class="thumbnail offer-thumbnail" ng-click="goTo('offer.details', { id: offer.id })">
		
	<header class="thumbnail__text--top">
		<h3>{{ offer.template.title }}</h3>
	</header>

	<div class="thumbnail__background">
		<img ng-src="/static/images/{{ offer.template.pictures[0].filename }}" />
	</div>

	<footer class="thumbnail__text--bottom">
		<p>{{ offer.template.description }}</p>
	</footer>

</section>