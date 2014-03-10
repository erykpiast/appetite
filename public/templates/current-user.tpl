<section class="current-user" ng-click="goTo('user.details', { id: user.id })">
	
	<header class="current-user__header">
		<h3 class="current-user__name">{{ user.fullName }}</h3>

		<img ng-src="/images/{{ user.avatar.filename }}" />
	</header>

</section>