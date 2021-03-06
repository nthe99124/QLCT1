using System;   
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using QLCT.Models;
using PagedList;

namespace QLCT.Controllers
{
    public class CustomerController : Controller
    {
        public QLCTDataContext db = new QLCTDataContext();
        // GET: Customer
        #region Get Customer
        // View KH tiềm năng
        public ActionResult Index1(int? page)
        {

            if (Session["user"] ==null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewcus = from c in db.Customers
                          where c.IsDeleted == false
                          where c.Status == 1
                          orderby c.Name descending
                          select c;
            foreach (var item in viewcus.ToList())
            {
                string strdate = item.StartDate.ToString("dd/MM/yy");
            }
            return View(viewcus.ToPagedList(page ?? 1, 20));
        }
        [HttpPost]

        public ActionResult Index1(int? page, FormCollection a)
        {
            var viewpro = from c in db.Customers
                          where c.Name.Contains(Request["key"])
                          where c.IsDeleted == false
                          where c.Status == 1
                          select c;
            return View(viewpro.ToPagedList(page ?? 1, 20));
        }
        // View KH ngắn hạn
        
        public ActionResult Index2(int? page)
        {

            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewcus = from c in db.Customers
                          where c.IsDeleted == false
                          where c.TypeOfDebt == 1
                          orderby c.Name descending
                          select c;
            return View(viewcus.ToPagedList(page ?? 1, 20));
        }
        [HttpPost]
        public ActionResult Index2(int? page, FormCollection a)
        {

            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewcus = from c in db.Customers
                          where c.Name.Contains(Request["key"])
                          where c.IsDeleted == false
                          where c.TypeOfDebt == 1
                          orderby c.Name descending
                          select c;
            return View(viewcus.ToPagedList(page ?? 1, 20));
        }
        // View KH dài hạn
        public ActionResult Index3(int? page)
        {

            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewcus = from c in db.Customers
                          where c.IsDeleted == false
                          where c.TypeOfDebt == 2
                          orderby c.Name descending
                          select c;
            return View(viewcus.ToPagedList(page ?? 1, 20));
        }
        [HttpPost]
        public ActionResult Index3(int? page, FormCollection a)
        {

            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewcus = from c in db.Customers
                          where c.Name.Contains(Request["key"])
                          where c.IsDeleted == false
                          where c.TypeOfDebt == 2
                          orderby c.Name descending
                          select c;
            return View(viewcus.ToPagedList(page ?? 1, 20));
        }
        public ActionResult Index4(int? page)
        {

            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewcus = from c in db.Customers
                          where c.IsDeleted == false
                          where c.TypeOfDebt == 1? Convert.ToInt32(DateTime.Compare(DateTime.Now,c.StartDate.AddMonths(6)))== 1 : Convert.ToInt32(DateTime.Compare(DateTime.Now, c.StartDate.AddMonths(12))) == 1
                          orderby c.Name descending
                          select c;
            return View(viewcus.ToPagedList(page ?? 1, 20));
        }
        [HttpPost]
        public ActionResult Index4(int? page, FormCollection a)
        {

            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var viewcus = from c in db.Customers
                          where c.Name.Contains(Request["key"])
                          where c.IsDeleted == false
                          where c.TypeOfDebt == 2
                          orderby c.Name descending
                          select c;
            return View(viewcus.ToPagedList(page ?? 1, 20));
        }
        #endregion
        // Insert
        public ActionResult Insert()
        {
            if (Session["user"] == null)                                                                                             
            {
                return RedirectToAction("Index", "Log");
            }
            ViewBag.IdStaff = from u in db.Users where u.IdDepartment == 3 select u;
            return View();
        }
        [HttpPost]
        public ActionResult Insert(Customer cus)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var checkcus = db.Customers.Where(c => c.TIN == Request["TIN"]).FirstOrDefault();
            if(checkcus == null)
            {
                cus.IdStaff = Convert.ToInt32(Request["IdStaff"]);
                cus.Name = Request["Name"];
                cus.Phone = Request["Phone"];
                cus.Address = Request["Address"];
                cus.Debt = Convert.ToInt32(Request["Debt"]);
                cus.StartDate = Convert.ToDateTime(Request["StartDate"]);
                cus.TIN = Request["TIN"];
                cus.BankNumber = Request["BankNumber"];
                cus.BankName = Request["BankName"];
                cus.BankAddress = Request["BankAddress"];
                cus.Status = Convert.ToInt32(Request["Status"]);
                cus.TypeOfDebt = Convert.ToInt32(Request["TypeOfDebt"]);
                cus.IsDeleted = false;
                db.Customers.InsertOnSubmit(cus);
                // tang so luong cus quan ly
                var increaseCus = db.Users.Where(c => c.Id == Convert.ToInt32(Request["IdStaff"])).FirstOrDefault();
                increaseCus.NumberCus += 1;
                UpdateModel(increaseCus);
                db.SubmitChanges();
            }
            else
            {
                return Content("<script language='javascript' type='text/javascript'>var url = '/Customer/Insert';var result = confirm('Mã số thuế này đã tồn tại!');if (result) {window.location.href = url;}</script>");
            }
            return this.Insert();
        }
        // Update
        public ActionResult Update(int id)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            var cus = db.Customers.First(c => c.Id == id);
            ViewBag.lstStaff = from u in db.Users
                               where u.IsDeleted == false
                               where u.IdDepartment == 3
                               select new { u.Id, u.Name };
            return View(cus);
        }
        [HttpPost]
        public ActionResult Update(int id,Customer cus)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            cus = db.Customers.Where(c => c.Id == id).SingleOrDefault();
            cus.IdStaff = Convert.ToInt32(Request["IdStaff"]);
            cus.Name = Request["Name"];
            cus.Phone = Request["Phone"];
            cus.Address = Request["Address"];
            cus.Debt = Decimal.Parse(Request["Debt"]);
            cus.StartDate = Convert.ToDateTime(Request["StartDate"]);
            cus.TIN = Request["TIN"];
            cus.BankNumber = Request["BankNumber"];
            cus.BankName = Request["BankName"];
            cus.BankAddress = Request["BankAddress"];
            cus.Status = Convert.ToInt32(Request["Status"]);
            cus.TypeOfDebt = Convert.ToInt32(Request["TypeOfDebt"]);
            UpdateModel(cus);
            db.SubmitChanges();
            return this.Update(id);
        }
        // Delete -- Update IsDelete
        public ActionResult Delete(int id, Customer cus)
        {
            if (Session["user"] == null)
            {
                return RedirectToAction("Index", "Log");
            }
            cus = db.Customers.Where(c => c.Id == id).SingleOrDefault();
            cus.IsDeleted = true;
            UpdateModel(cus);
            db.SubmitChanges();
            return RedirectToAction("Index1","Customer");
        }
    }
}