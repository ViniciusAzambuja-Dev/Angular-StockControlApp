import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CategoriesService } from 'src/app/services/categories/categories.service';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CategoryEvent } from 'src/app/models/enums/categories/CategoryEvent';
import { EditCategoryAction } from 'src/app/models/interfaces/categories/event/EditCategoryAction';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: []
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject;

  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION;
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION;

  public categoryAction!: { event: EditCategoryAction }
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required],
  })

  constructor(
    public ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private categoriesService: CategoriesService,
  ) {}

  ngOnInit(): void {

  }

  handleSubmitAddCategory(): void {
    if(this.categoryForm?.value && this.categoryForm?.valid){
      const requestCreateCategory: { name: string } = {
        name: this.categoryForm.value.name as string,
      };

      this.categoriesService.createNewCategory(requestCreateCategory)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if(response) {
            this.categoryForm.reset();
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Categoria criada com sucesso!',
              life: 3000,
            });
          }
        },
        error: (err) => {
          console.log(err);
          this.categoryForm.reset();
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao criar categoria!',
            life: 3000,
          });
        },
      });
    }
  }

  ngOnDestroy(): void {

  }
}