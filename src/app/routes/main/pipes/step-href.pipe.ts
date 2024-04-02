import { inject, Pipe, PipeTransform } from '@angular/core';

import { AdjustedDataset, Step } from '~/models';
import { RouterService, Zip } from '~/services';

@Pipe({ name: 'stepHref' })
export class StepHrefPipe implements PipeTransform {
  routerSvc = inject(RouterService);

  transform(
    value: Step,
    zipPartial: Zip,
    data: AdjustedDataset,
  ): string | null {
    let step = value;
    if (step.recipeId) {
      const recipe = data.adjustedRecipe[step.recipeId];
      if (recipe.isTechnology && recipe.productivity && value.items) {
        // Adjust items to account for productivity bonus
        step = {
          ...value,
          ...{ items: value.items.div(recipe.productivity) },
        };
      }
    }
    return this.routerSvc.stepHref(step, zipPartial, data.hash);
  }
}
