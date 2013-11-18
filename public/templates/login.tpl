<div class="login">

	<ul class="login__services">
		<li class="login__service" ng-repeat="service in authServices">
			<app-sign-button service="{{ service }}"></app-sign-button>
		</li>
	</ul>

</div>