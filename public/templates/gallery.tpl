<section class="gallery">
	<ul class="gallery--pictures horizontal">
		<li class="gallery--picture" ng-repeat="picture in pictures">
			<img src="/static/images/{{ picture.filename }}" alt="" />
		</li>
	</ul>	
</section>
