package stnk.onit.numo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping("/")
    public String rootRedirect() {
        return "redirect:/login.html";
    }
}