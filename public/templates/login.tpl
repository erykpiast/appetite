<div class="login">

	<ul class="login__services" ng-if="!loggedIn">
		<li class="login__service" ng-repeat="service in authServices">
			<app-sign-button service="{{ service.name }}" label="{{ service.label }}"></app-sign-button>
		</li>
	</ul>

	<div class="" ng-if="!!loggedIn">
		<app-unsign-button service="{{ currentService.name }}" label="{{ currentService.label }}"></app-unsign-button>
	</div>

</div>