/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

import { NavigatedData, Page } from "@nativescript/core";
import HttpClient from "~/utils/Http";

import { MainSceneViewModel } from "./main-scene-view-model";

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;

    page.bindingContext = new MainSceneViewModel(page.navigationContext.name, new HttpClient('https://opentdb.com/api.php?amount=20&category=15&difficulty=medium'));
}
