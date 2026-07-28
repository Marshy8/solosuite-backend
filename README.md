# Buck M Harris - SoloSuite Backend

I am Buck Harris, and if you are reading this then thank you for taking a look at my work. So time for a little backstory on this project. 

I was for a little while deciding to go to barber school after my time at university studying computer science. I didn't want to lose my 
skills developing though so I decided that while I was in barber school I would create a backend for myself as will as for other solo barbers
that would provide easy functionality to their custom frontend like the Google API, Stripe API, and a simple database for things like customer 
notes, scheduling blocks, service type data, etc. 

I quickly then decided that barbering was not for me but that software development was the real path for me (at least for now)!!! I decided 
though that his project would not be in vain as my partner is a nail tech and the backend could be adjusted to service all manner of pink
collar workers and maybe even beyond. I also still needed a project to showcase me and my abilities.

As of right now the project is still in development as I really only have the bones of the Google API connection and usefulness coded into it, 
but be rest assured that I will be working hard to make as much progress on it as possible to fulfill all my goals with it.

Now you would probably like to know the road map for this project. The road map will be as follows:

1. Calendar

- The project authenticates with the Google Calendar API in a way that allows the connected cosmetologist's Google account to seamlessly auto-schedule
  appointments for the cosmetologist. It will take into account specific break, cleaning, lunch, holiday, etc. events that will be gathered from the
  cosmetologist's input and applied to the cosmetologist's Google calendar.

2. Payment

- The project's payment will be handled with Stripe's API. It will account for all possible instances of payment for tracking reasons. It will cover card
  payment, client installment payment, cash payment, tips, etc. It will have an endpoints that will allow calls from the cosmetologist that can set things
  like deposit amount, upfront full payment discount, etc.

3. Notes

- The project will contain a way for the cosmetologist to submit notes about clients in a clean and concise way. It will record things like the client's name,
  hair type, hair style, conversational notes, etc. as a way for the cosmetologist to have a personalized experience for each client. It will allow the
  cosmetologist to request information on each client, which the project will be able to pull from its database.

4. Bank (stretch goal)

- The project will have access to the Teller API in a way that will collect transactional data from the cosmetologist's bank account. This will populate the database
  with information about expenses and income for tax accounting so that it can be passed off to a tax pro quarterly for the best odds of no audits and tax breaks. It
  will submit snapshots to the cosmetologist's Google Sheets, where a data dashboard will be constructed by the cosmetologist.

# How To Run It On Your Machine

WORK IN PROGRESS!!
