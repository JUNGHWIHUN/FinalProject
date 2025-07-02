package kr.or.iei.book.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import kr.or.iei.book.model.service.BookService;

@RestController 
@CrossOrigin("*") 
@RequestMapping("/book") 
public class BookController {
	
	@Autowired
	private BookService service;

}
